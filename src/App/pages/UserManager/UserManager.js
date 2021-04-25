import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Tag, Input } from 'antd';
import Aux from "../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    LockOutlined,
    UnlockOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
import CreateDrawer from './CreateDrawer/drawer';
import Highlighter from 'react-highlight-words';

const { confirm } = Modal;

const UserManager = () => {

    const [role, setRole] = useState("");
    useEffect(() => {
        const location = window.location.pathname.split("/").pop();
        console.log(location)
        setRole(location)
    }, [])

    const [visible, setVisible] = useState(false);

    const [listUser, setListUsers] = useState([]);

    const [user, setUser] = useState({});

    const [loading, setLoading] = useState(false);

    const [totalRecords, setTotalRecords] = useState(0);

    const [statusFilter, setStatusFilter] = useState(null);

    const [pageConfig, setPageConfig] = useState({
        page: 1,
        pageSize: 20
    });

    const [searchText, setSearchText] = useState("");

    const handleChange = (pagination, filters) => {
        const { current, pageSize } = pagination
        const status = filters.status ? filters.status[0] : null;
        setPageConfig({ page: current, pageSize: pageSize });
        setStatusFilter(status);
    };

    const pagination = {
        defaultCurrent: pageConfig.page,
        defaultPageSize: pageConfig.pageSize,
        showQuickJumper: true,
        total: totalRecords,
        showTotal: total => `Total ${total} records`,
    }

    const handleAddResponses = (user) => {
        setListUsers([user, ...listUser]);
    }

    const handleUpdateResponses = (user) => {
        const users = [...listUser];
        const index = users.findIndex(value => value._id === user._id);
        users[index] = user;
        setListUsers(users);
    }

    const lockUser = (id) => {
        const token = getCookie("token");
        return axios
            .put(`${process.env.REACT_APP_API_URL}/admin/user/${id}/lock`, {}, {
                headers: {
                    Authorization: token,
                },
            })
    };

    useEffect(() => {
        if (role !== "") {
            getUsers(pageConfig.page, pageConfig.pageSize, statusFilter, searchText);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, pageConfig, statusFilter, searchText])

    const getUsers = (page, pageSize, status, code) => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/user/${role}`,
                {
                    page, pageSize, status, code
                }
                , {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                const data = [];
                const arr = res.data.users;
                arr.forEach((element) => {
                    data.push({ key: data.length, ...element });
                });
                setLoading(false);
                setListUsers(data);
                setTotalRecords(res.data.total);
            })
            .catch(err => {
                handleError(err);
            });
    };

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
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            ...getColumnSearchProps('code')
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            key: 'emailAddress',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
                let color = record.status === 'activated' ? 'success' :
                    (record.status === 'suspended' ? 'error' : 'warning')
                return (
                    <Tag color={color}>{record.status}</Tag>
                )
            },
            filterMultiple: false,
            filters: [
                { text: 'Activated', value: 'activated' },
                { text: 'Not activated', value: 'not_activated' },
                { text: 'Suspended', value: 'suspended' },
            ],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type={record.status === "suspended" ? 'primary' : 'danger'}
                        icon={record.status === "suspended" ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => {
                            showConfirmLockUser(record)
                        }}
                    >
                        {record.status === "suspended" ? 'Unlock' : 'Lock'}
                    </Button>
                </Space >
            ),
        },
    ];

    const showConfirmLockUser = (record) => {
        confirm({
            title: `Do you want to ${record.status === "suspended" ? "Unlock" : "Lock"} this teacher : ${record.lastName}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    lockUser(record._id)
                        .then((res) => {
                            notify.notifySuccess("Success", res.data.message)
                            handleUpdateResponses(res.data.user);
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
        notify.notifyError("Error", error.response?.data?.message)
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
                            <Card.Title as="h5">{role.toUpperCase()} MANAGER</Card.Title>
                            <span className="d-block m-t-5"></span>
                            {(role !== "register") ?
                                <Button type="primary" onClick={showDrawer}
                                    icon={<PlusOutlined />}
                                >Add {role}</Button>
                                : null
                            }
                        </Card.Header>
                        <Card.Body>
                            <Table bordered
                                columns={columns}
                                dataSource={listUser}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleChange}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {(role !== "register") ?
                <CreateDrawer role={role}
                    handleAddResponses={handleAddResponses}
                    visible={visible}
                    setVisible={setVisible}
                    user={user}
                    setUser={setUser} />
                : null
            }
        </Aux>
    );
}

export default UserManager;