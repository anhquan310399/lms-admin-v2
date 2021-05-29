import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Typography, Tag, Input, Tooltip } from 'antd';
import Aux from "../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
import CurriculumDrawer from './CurriculumDrawer';
import Highlighter from 'react-highlight-words';

const { confirm } = Modal;

const CurriculumManager = () => {
    const [visible, setVisible] = useState(false);

    const [listCurriculums, setListCurriculums] = useState([]);

    const [curriculum, setCurriculum] = useState({});

    const [loading, setLoading] = useState(false);

    const handleAddResponses = (curriculum) => {
        setListCurriculums([curriculum, ...listCurriculums]);
    }

    const handleUpdateResponses = (curriculum) => {
        const curriculums = [...listCurriculums];
        const index = curriculums.findIndex(value => value._id === curriculum._id);
        curriculums[index] = curriculum;
        setListCurriculums(curriculums);
    }

    const handleDeleteResponses = (idCurriculum) => {
        setListCurriculums(listCurriculums.filter(value => value._id !== idCurriculum));
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

    const deleteCurriculum = (id) => {
        const token = getCookie("token");
        return axios
            .delete(`${process.env.REACT_APP_API_URL}/admin/curriculum/${id}/`, {
                headers: {
                    Authorization: token,
                },
            })
    };

    const [totalRecords, setTotalRecords] = useState(0);

    const handleTableChange = (pagination, filters) => {
        const { current, pageSize } = pagination;
        setPageConfig({ page: current, pageSize });
    }

    const [pageConfig, setPageConfig] = useState({
        page: 1,
        pageSize: 20
    });

    const [searchText, setSearchText] = useState("");

    const getCurriculums = (page, pageSize, name) => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/curriculum/filter`,
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
                const arr = res.data.curriculums;
                arr.forEach((element) => {
                    data.push({ key: data.length, ...element });
                });
                setLoading(false);
                setListCurriculums(data);
                setTotalRecords(res.data.total);
            })
            .catch(err => {
                handleError(err);
            });
    };

    useEffect(() => {
        getCurriculums(pageConfig.page, pageConfig.pageSize, searchText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
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
                                setCurriculum(record);
                                showDrawer();
                            }}
                        >
                            {/* Edit */}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Curriculum">
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

    const showConfirmDelete = (record) => {
        confirm({
            title: `Do you Want to Delete this curriculum : ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // return deleteUser(record._id);
                return new Promise((resolve, reject) => {
                    deleteCurriculum(record._id)
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
                            <Card.Title as="h5">Curriculum Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add curriculum</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered columns={columns}
                                dataSource={listCurriculums}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <CurriculumDrawer handleResponses={handleResponses} visible={visible} setVisible={setVisible} curriculum={curriculum} setCurriculum={setCurriculum} />

        </Aux>
    );
}

export default CurriculumManager;