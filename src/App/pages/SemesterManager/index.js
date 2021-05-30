/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Input, Tag, Tooltip } from 'antd';
import Aux from "../../../hoc/_Aux";
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
import SemesterDrawer from './SemesterDrawer'
import Highlighter from 'react-highlight-words';

const { confirm } = Modal;

const SemesterManager = () => {
    const [visible, setVisible] = useState(false);

    const [listSemester, setListSemesters] = useState([]);

    const [semester, setSemester] = useState({});

    const [loading, setLoading] = useState(false);

    const [reload, setReload] = useState(false);

    const handleAddResponses = (semester) => {
        setListSemesters([semester, ...listSemester]);
    }

    const handleUpdateResponses = (semester) => {
        const courses = [...listSemester];
        const index = courses.findIndex(value => value._id === semester._id);
        courses[index] = semester;
        setListSemesters(courses);
    }

    const handleResponses = (method, data) => {
        switch (method) {
            case "add":
                handleAddResponses(data);
                break;
            case "update":
                handleUpdateResponses(data);
                break;
            default:
                break;
        }
    }

    const setCurrentSemester = (id) => {
        const token = getCookie("token");
        return axios
            .put(`${process.env.REACT_APP_API_URL}/admin/semester/${id}/force`, {}, {
                headers: {
                    Authorization: token,
                },
            })
    };

    const [totalRecords, setTotalRecords] = useState(0);


    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        setPageConfig({ page: current, pageSize });
    }

    const [pageConfig, setPageConfig] = useState({
        page: 1,
        pageSize: 20
    });

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getSemesters(pageConfig.page, pageConfig.pageSize, searchText);
    }, [pageConfig, searchText, reload]);

    const pagination = {
        defaultCurrent: pageConfig.page,
        defaultPageSize: pageConfig.pageSize,
        showQuickJumper: true,
        total: totalRecords,
        showTotal: total => `Total ${total} records`,
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleResetSearch(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: text =>
        (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        )
    });

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleResetSearch = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const getSemesters = (page, pageSize, name) => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/semester/filter`,
                {
                    page, pageSize, name
                },
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                const data = [];
                const arr = res.data.semesters;
                arr.forEach((element) => {
                    data.push({ key: data.length, ...element });
                });
                setLoading(false);
                setListSemesters(data);
                setTotalRecords(res.data.total);
            })
            .catch(err => {
                handleError(err);
            });
    };

    const columns = [
        {
            title: '#',
            render: (text, record, index) => {
                return (pageConfig.page - 1) * pageConfig.pageSize + index + 1
            },
            responsive: ['md'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit this semester">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSemester(record);
                                showDrawer();
                            }}
                        >

                        </Button>
                    </Tooltip>

                    {record.isCurrent ?
                        (<Tag color="#f50">
                            Current
                        </Tag>)
                        :
                        (
                            <Tooltip title="Set this semester to primary">
                                <Button
                                    type="primary"
                                    icon={<BookOutlined />}
                                    onClick={() => {
                                        showConfirmSetCurrent(record)
                                    }}>
                                    Set</Button>
                            </Tooltip>
                        )
                    }
                </Space >
            ),
        },
    ];

    const showConfirmSetCurrent = (record) => {
        confirm({
            title: `Do you want to set semester "${record.name}" to current semester?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise((resolve, reject) => {
                    setCurrentSemester(record._id)
                        .then((res) => {
                            notify.notifySuccess("Success", res.data.message)
                            setReload(!reload);
                            resolve();
                        }).catch(err => {
                            handleError(err);
                            resolve();
                        });
                });
            },
        });
    }

    const handleError = (error) => {
        console.log(error);
        notify.notifyError("Error", error.message)
    }

    const showDrawer = () => {
        setVisible(true);
    };

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Semester Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add Semester</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={listSemester}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <SemesterDrawer handleResponses={handleResponses} visible={visible} setVisible={setVisible} semester={semester} setSemester={setSemester} />
        </Aux>
    );
}

export default SemesterManager;