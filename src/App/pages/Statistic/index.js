/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Table, Select } from 'antd';
import Aux from "../../../hoc/_Aux";
import NVD3Chart from 'react-nvd3';
import { CSVLink } from "react-csv";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    BookOutlined,
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
const { Option } = Select;

const Statistic = () => {

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [statistic, setStatistic] = useState(null);

    const [chartData, setChartData] = useState([]);

    const [listSemesters, setListSemesters] = useState([]);

    const [currentSemesterId, setCurrentSemesterId] = useState(null);

    const [isLoadingSemesters, setLoadingSemesters] = useState(false);

    const headers = [
        { label: "MSSV", key: "code" },
        { label: "Họ lót", key: "firstName" },
        { label: "Tên", key: "lastName" },
        { label: "Tên Khoa", key: "faculty" },
        { label: "CTĐT", key: "curriculum" },
        { label: "Lớp SV", key: "class" },
        { label: "DTBHT", key: "gpa" }
    ];

    const [columns, setColumns] = useState([]);

    const pagination = {
        showQuickJumper: true,
        showTotal: total => `Total ${total} records`,
    }

    useEffect(() => {
        setLoadingSemesters(true);
        axios.get(`${process.env.REACT_APP_API_URL}/admin/semester`,
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            }
        ).then(res => {
            setListSemesters(res.data.semesters);

            const semester = res.data.semesters.find(value => value.isCurrent);

            setCurrentSemesterId(semester._id);

        }).catch(err => {
            notify.notifyError(err.response?.data?.message || err.message);
        }).finally(() => {
            setLoadingSemesters(false);
        })
    }, [])

    useEffect(() => {
        if (currentSemesterId != null) {
            setLoading(true);
            axios.get(`${process.env.REACT_APP_API_URL}/admin/statistic/learning/${currentSemesterId}`,
                {
                    headers: {
                        'Authorization': getCookie("token")
                    }
                }
            ).then(res => {
                setStatistic(res.data.statistic);
                setResult(res.data.result);
            }).catch(err => {
                notify.notifyError(err.response?.data?.message || err.message);
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [currentSemesterId])

    useEffect(() => {
        if (statistic) {
            setChartData([{
                values: statistic,
                key: 'Students',
                color: '#A389D4'
            }])
        }
    }, [statistic])

    const getColumnTable = (facultyFilters, classFilters) => {
        return [
            {
                title: 'MSSV',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: 'Họ lót',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Tên',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Tên Khoa',
                dataIndex: 'faculty',
                key: 'faculty',
                filters: facultyFilters,
                onFilter: (value, record) => record.faculty.includes(value),
            },
            {
                title: 'CTĐT',
                dataIndex: 'curriculum',
                key: 'curriculum',
            },
            {
                title: 'Lớp SV',
                dataIndex: 'class',
                key: 'class',
                filters: classFilters,
                onFilter: (value, record) => record.class.includes(value),
            },
            {
                title: 'ĐTBHT',
                dataIndex: 'gpa',
                key: 'gpa',
                sorter: (a, b) => a.gpa - b.gpa,
            },
        ]
    }

    useEffect(() => {
        if (result) {
            const facultyFilters = result.map(({ faculty }) => {
                return { text: faculty, value: faculty }
            }).filter((faculty, index, array) => {
                return index === array.findIndex(value => value.text === faculty.text);
            });

            const classFilters = result.map(({ class: cls }) => {
                return { text: cls, value: cls }
            }).filter((cls, index, array) => {
                return index === array.findIndex(value => value.text === cls.text);
            });

            setColumns(getColumnTable(facultyFilters, classFilters));
        }
    }, [result])

    return (
        <Aux>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Choose semester</Card.Title>

                            <Select
                                className="ml-4"
                                showSearch
                                showArrow
                                style={{ width: 400 }}
                                placeholder="Select a semester"
                                optionFilterProp="children"
                                onChange={(value) => { setCurrentSemesterId(value) }}
                                loading={isLoadingSemesters}
                                value={currentSemesterId}
                            >
                                {
                                    listSemesters.map(semester => {
                                        return <Option value={semester._id}>{semester.name}</Option>
                                    })
                                }
                            </Select>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Learning statistic</Card.Title>
                            <span className="d-block m-t-5"></span>
                        </Card.Header>
                        <Card.Body>
                            {chartData &&
                                React.createElement(NVD3Chart, {
                                    xAxis: {
                                        tickFormat: function (d) { return d; },
                                        axisLabel: 'Score'
                                    },
                                    yAxis: {
                                        axisLabel: 'Number of students',
                                        tickFormat: function (d) { return d; }
                                    },
                                    type: 'discreteBarChart',
                                    datum: chartData,
                                    x: 'score',
                                    y: 'count',
                                    height: 400,
                                })
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Learning result</Card.Title>
                            {result &&
                                <CSVLink
                                    data={result}
                                    headers={headers}
                                    filename={"learning-result.csv"}
                                    className="btn btn-primary pull-right">
                                    Download
                                </CSVLink>
                            }
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={result}
                                pagination={pagination}
                                loading={loading} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
}

export default Statistic;