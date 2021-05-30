/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Input, Tag, Tooltip } from 'antd';
import Aux from "../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
import FacultyDrawer from './FacultyDrawer';
import Highlighter from 'react-highlight-words';

const { confirm } = Modal;

const FacultyManager = () => {
    const [visible, setVisible] = useState(false);

    const [listFaculties, setFaculties] = useState([]);

    const [faculty, setFaculty] = useState({});

    const [loading, setLoading] = useState(false);

    const handleAddResponses = (faculty) => {
        setFaculties([faculty, ...listFaculties]);
    }

    const handleDeleteResponses = (idFaculty) => {
        setFaculties(listFaculties.filter(value => value._id !== idFaculty));
    }

    const handleUpdateResponses = (faculty) => {
        const faculties = [...listFaculties];
        const index = faculties.findIndex(value => value._id === faculty._id);
        faculties[index] = faculty;
        setFaculties(faculties);
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
        getFaculties(pageConfig.page, pageConfig.pageSize, searchText);
    }, [pageConfig, searchText]);

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

    const getFaculties = (page, pageSize, name) => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/faculty/filter`,
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
                const arr = res.data.faculties;
                arr.forEach((element) => {
                    data.push({ key: data.length, ...element });
                });
                setLoading(false);
                setFaculties(data);
                setTotalRecords(res.data.total);
            })
            .catch(err => {
                handleError(err);
            });
    };

    const showConfirmDelete = (record) => {
        confirm({
            title: `Do you Want to Delete this subject : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    deleteFaculty(record._id)
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

    const deleteFaculty = (id) => {
        const token = getCookie("token");
        return axios
            .delete(`${process.env.REACT_APP_API_URL}/admin/faculty/${id}/`, {
                headers: {
                    Authorization: token,
                },
            })
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
            title: 'Code',
            key: 'code',
            dataIndex: 'code',
            responsive: ['md'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit this faculty">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setFaculty(record);
                                showDrawer();
                            }}
                        >

                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete faculty">
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => { showConfirmDelete(record) }}
                        >
                            {/* Delete */}
                        </Button>
                    </Tooltip>
                </Space >
            ),
        },
    ];

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
                            <Card.Title as="h5">Faculty Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add Faculty</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={listFaculties}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <FacultyDrawer handleResponses={handleResponses} visible={visible} setVisible={setVisible} faculty={faculty} setFaculty={setFaculty} />

        </Aux>
    );
}

export default FacultyManager;