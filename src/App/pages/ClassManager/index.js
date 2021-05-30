import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Typography, Input, Tooltip } from 'antd';
import Aux from "../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import * as notify from '../../../services/notify';
import { getCookie } from '../../../services/localStorage';
import axios from 'axios';
import ClassDrawer from './ClassDrawer';
import Highlighter from 'react-highlight-words';
import StudentManager from './StudentManager';

const { Text } = Typography;
const { confirm } = Modal;

const SubjectManager = () => {
    const [isDrawerVisible, setDrawerVisible] = useState(false);

    const [listClasses, setListClasses] = useState([]);

    const [editClass, setEditClass] = useState({});

    const [loading, setLoading] = useState(false);

    /**
     * Class manage student
     */
    const [manageStudent, setManageStudent] = useState({});

    const [isManageStudent, setManageStudentVisible] = useState(false);

    const handleAddResponses = (cls) => {
        setListClasses([cls, ...listClasses]);
    }

    const handleUpdateResponses = (cls) => {
        const classes = [...listClasses];
        const index = classes.findIndex(value => value._id === cls._id);
        classes[index] = cls;
        setListClasses(classes);
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

    const handleTableChange = (pagination, filters) => {
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
                .post(`${process.env.REACT_APP_API_URL}/admin/class/filter`,
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
                    const arr = res.data.classes;
                    arr.forEach((element) => {
                        data.push({ key: data.length, ...element });
                    });
                    setLoading(false);
                    setListClasses(data);
                    setTotalRecords(res.data.total);
                })
                .catch(err => {
                    handleError(err);
                });
        };
        getSubjects(pageConfig.page, pageConfig.pageSize, searchText);
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
            title: 'Curriculum',
            dataIndex: 'curriculum',
            key: 'curriculum',
            render: (text, record) => {
                return (
                    <Text strong > {record.curriculum.name}</Text>
                )
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit this class">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditClass(record);
                                showDrawer();
                            }}
                        >
                            {/* Edit */}
                        </Button>
                    </Tooltip>

                    <Tooltip title="Show students">
                        <Button
                            type="primary"
                            icon={<DatabaseOutlined />}
                            onClick={() => {
                                setManageStudent(record);
                                setManageStudentVisible(true);
                            }}
                        >
                        </Button>
                    </Tooltip>
                </Space >
            ),
        },
    ];

    const handleError = (error) => {
        notify.notifyError("Error", error.message)
    }

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Class Manager</Card.Title>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={showDrawer}
                                icon={<PlusOutlined />}
                            >Add Class</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered columns={columns}
                                dataSource={listClasses}
                                pagination={pagination}
                                loading={loading}
                                onChange={handleTableChange} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ClassDrawer handleResponses={handleResponses} visible={isDrawerVisible} setVisible={setDrawerVisible} cls={editClass} setClass={setEditClass} />

            {manageStudent && isManageStudent &&
                <StudentManager currentClass={manageStudent} visible={isManageStudent} setVisible={setManageStudentVisible} />

            }
        </Aux>
    );
}

export default SubjectManager;