import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Input, Tag } from 'antd';
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
import CourseDrawer from './CourseDrawer/drawer';
import Highlighter from 'react-highlight-words';

const { confirm } = Modal;

const CourseManager = () => {
    const [visible, setVisible] = useState(false);

    const [listCourses, setListCourses] = useState([]);

    const [course, setCourse] = useState({});

    const [loading, setLoading] = useState(false);

    const [reload, setReload] = useState(false);

    const handleAddResponses = (course) => {
        setListCourses([course, ...listCourses]);
    }

    const handleUpdateResponses = (course) => {
        const courses = [...listCourses];
        const index = courses.findIndex(value => value._id === course._id);
        courses[index] = course;
        setListCourses(courses);
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

    const setCurrentCourse = (id) => {
        const token = getCookie("token");
        return axios
            .put(`${process.env.REACT_APP_API_URL}/admin/course/${id}/force`, {}, {
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
        getCourses(pageConfig.page, pageConfig.pageSize, searchText);
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

    const getCourses = (page, pageSize, name) => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/course/filter`,
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
                const arr = res.data.courses;
                arr.forEach((element) => {
                    data.push({ key: data.length, ...element });
                });
                setLoading(false);
                setListCourses(data);
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
        },
        {
            title: 'Course name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },

        {
            title: 'Subjects',
            key: 'subjects',
            dataIndex: 'subjects'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCourse(record);
                            showDrawer();
                        }}
                    >
                        Edit
                    </Button>
                    {record.isCurrent ?
                        (<Tag color="#f50">
                            Current Course
                        </Tag>)
                        :
                        (
                            <Button
                                type="primary"
                                icon={<BookOutlined />}
                                onClick={() => {
                                    showConfirmSetCurrent(record)
                                }}
                            >
                                Set Current
                            </Button>
                        )
                    }

                </Space >
            ),
        },
    ];

    const showConfirmSetCurrent = (record) => {
        confirm({
            title: `Do you Want to set course "${record.name}" to current course?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    setCurrentCourse(record._id)
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
        notify.notifyError("Error", error?.response?.data?.message)
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
                            <Card.Title as="h5">Course Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add Course</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={listCourses}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <CourseDrawer handleResponses={handleResponses} visible={visible} setVisible={setVisible} course={course} setCourse={setCourse} />
        </Aux>
    );
}

export default CourseManager;