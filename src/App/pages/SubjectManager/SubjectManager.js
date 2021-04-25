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
import SubjectDrawer from './SubjectDrawer/drawer';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;
const { confirm } = Modal;

const SubjectManager = () => {
    const [visible, setVisible] = useState(false);

    const [listSubject, setListSubject] = useState([]);

    const [subject, setSubject] = useState({});

    const [loading, setLoading] = useState(false);

    const handleAddResponses = (subject) => {
        setListSubject([subject, ...listSubject]);
    }

    const handleUpdateResponses = (subject) => {
        const subjects = [...listSubject];
        const index = subjects.findIndex(value => value._id === subject._id);
        subjects[index] = subject;
        setListSubject(subjects);
    }

    const handleDeleteResponses = (idSubject) => {
        setListSubject(listSubject.filter(value => value._id !== idSubject));
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

    const lockSubject = (id) => {
        const token = getCookie("token");
        return axios
            .put(`${process.env.REACT_APP_API_URL}/admin/subject/${id}/hide`, {}, {
                headers: {
                    Authorization: token,
                },
            })
    };

    const deleteSubject = (id) => {
        const token = getCookie("token");
        return axios
            .delete(`${process.env.REACT_APP_API_URL}/admin/subject/${id}/`, {
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
                .post(`${process.env.REACT_APP_API_URL}/admin/subject/filter`,
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
                    const arr = res.data.allSubject;
                    arr.forEach((element) => {
                        data.push({ key: data.length, ...element });
                    });
                    setLoading(false);
                    setListSubject(data);
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
            title: 'Subject name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Lecture',
            dataIndex: 'lecture',
            key: 'lecture',
            render: (text, record) => {
                let name = `${record.lecture.firstName} ${record.lecture.lastName}`
                return (
                    <Text strong underline> {name}</Text>
                )
            },
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            render: (text, record) => {
                return (
                    <Text strong > {record.course.name}</Text>
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
                    <Tooltip title="Edit this user">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSubject(record);
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
                            onClick={() => { showConfirmLockSubject(record) }}
                        >
                            {/* {record.isDeleted ? 'Unlock' : 'Lock'} */}
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete user">
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => { showConfirmDeleteSubject(record) }}
                        >
                            {/* Delete */}
                        </Button>
                    </Tooltip>
                </Space >
            ),
        },
    ];

    const showConfirmLockSubject = (record) => {
        confirm({
            title: `Do you Want to ${record.isDeleted ? 'Unlock' : 'Lock'} this subject : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    lockSubject(record._id)
                        .then((res) => {
                            notify.notifySuccess("Success", res.data.message)
                            handleUpdateResponses(res.data.subject);
                            resolve();
                        }).catch(err => {
                            handleError(err);
                            resolve();
                        });
                });
            },
        });
    }

    const showConfirmDeleteSubject = (record) => {
        confirm({
            title: `Do you Want to Delete this subject : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    deleteSubject(record._id)
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
                            <Card.Title as="h5">Subject Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add subject</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered columns={columns}
                                dataSource={listSubject}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <SubjectDrawer handleResponses={handleResponses} visible={visible} setVisible={setVisible} subject={subject} setSubject={setSubject} />
        </Aux>
    );
}

export default SubjectManager;