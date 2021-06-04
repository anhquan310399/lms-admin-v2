import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Typography, Tag, Input, Tooltip } from 'antd';
import Aux from "../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
import CourseDrawer from './CourseDrawer';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;
const { confirm } = Modal;

const CourseManager = () => {
    const [visible, setVisible] = useState(false);

    const [listCourses, setListCourses] = useState([]);

    const [course, setCourse] = useState({});

    const [loading, setLoading] = useState(false);

    const handleAddResponses = (course) => {
        setListCourses([course, ...listCourses]);
    }

    const handleUpdateResponses = (course) => {
        const courses = [...listCourses];
        const index = courses.findIndex(value => value._id === course._id);
        courses[index] = course;
        setListCourses(courses);
    }

    const handleDeleteResponses = (idCourse) => {
        setListCourses(listCourses.filter(value => value._id !== idCourse));
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

    const lockCourse = (id) => {
        const token = getCookie("token");
        return axios
            .put(`${process.env.REACT_APP_API_URL}/admin/course/${id}/lock`, {}, {
                headers: {
                    Authorization: token,
                },
            })
    };

    const deleteCourse = (id) => {
        const token = getCookie("token");
        return axios
            .delete(`${process.env.REACT_APP_API_URL}/admin/course/${id}/`, {
                headers: {
                    Authorization: token,
                },
            })
    };

    const [totalRecords, setTotalRecords] = useState(0);

    const [roleFilter, setRoleFilter] = useState(null);

    const handleTableChange = (pagination, filters) => {
        const role = filters.role ? filters.role[0] : null;
        setRoleFilter(role);
        const { current, pageSize } = pagination;
        setPageConfig({ page: current, pageSize });
    }

    const [pageConfig, setPageConfig] = useState({
        page: 1,
        pageSize: 20
    });

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const getSubjects = (page, pageSize, role, name) => {
            const token = getCookie("token");
            setLoading(true);
            axios
                .post(`${process.env.REACT_APP_API_URL}/admin/course/filter`,
                    {
                        page, pageSize, role, name
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
        getSubjects(pageConfig.page, pageConfig.pageSize, roleFilter, searchText);
    }, [pageConfig, roleFilter, searchText]);

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

    const columns = [
        {
            title: '#',
            render: (text, record, index) => {
                return (pageConfig.page - 1) * pageConfig.pageSize + index + 1
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Teacher',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (text, record) => {
                let name = `${record.teacher.firstName} ${record.teacher.lastName}`
                return (
                    <Text strong underline> {name}</Text>
                )
            },
        },
        {
            title: 'Semester',
            dataIndex: 'semester',
            key: 'semester',
            render: (text, record) => {
                return (
                    <Text strong > {record.semester.name}</Text>
                )
            },
        },
        {
            title: 'Students',
            key: 'studentCount',
            dataIndex: 'studentCount'
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'config',
            render: (text, record) => {
                const color = record.config.role === 'public' ? 'success' : 'error';
                return (
                    <Tag color={color}>{record.config.role}</Tag>
                )
            },
            filterMultiple: false,
            filters: [
                { text: 'Public', value: 'public' },
                { text: 'Private', value: 'private' },
            ],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit this course">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCourse(record);
                                showDrawer();
                            }}
                        >
                            {/* Edit */}
                        </Button>
                    </Tooltip>

                    <Tooltip title={record.isDeleted ? 'Unlock' : 'Lock'}>
                        <Button
                            type='primary'
                            icon={record.isDeleted ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            onClick={() => { showConfirmLockCourse(record) }}
                        >
                            {/* {record.isDeleted ? 'Unlock' : 'Lock'} */}
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete this course">
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => { showConfirmDeleteCourse(record) }}
                        >
                            {/* Delete */}
                        </Button>
                    </Tooltip>
                </Space >
            ),
        },
    ];

    const showConfirmLockCourse = (record) => {
        confirm({
            title: `Do you want to ${record.isDeleted ? 'Unlock' : 'Lock'} this course : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    lockCourse(record._id)
                        .then((res) => {
                            notify.notifySuccess("Success", res.data.message)
                            handleUpdateResponses(res.data.course);
                            resolve();
                        }).catch(err => {
                            handleError(err);
                            resolve();
                        });
                });
            },
        });
    }

    const showConfirmDeleteCourse = (record) => {
        confirm({
            title: `Do you want to delete this course : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    deleteCourse(record._id)
                        .then((res) => {
                            notify.notifySuccess("Success", res.data.message)
                            handleDeleteResponses(record._id);
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
        notify.notifyError("Error", error.response.data.message)
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
                                bordered columns={columns}
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