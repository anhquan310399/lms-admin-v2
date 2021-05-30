import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Typography, Tooltip, Input } from 'antd';
import Aux from "../../../../hoc/_Aux";
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as notify from '../../../../services/notify';
import { getCookie } from '../../../../services/localStorage';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

import ExcelStudentModal from './ExcelStudentModal';

const { confirm } = Modal;
const { Text } = Typography;

const StudentManager = ({ currentClass, visible, setVisible }) => {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    const [isSaveChange, setSaveChange] = useState(false);

    const [isChanged, setChanged] = useState(false);

    const [reload, setReload] = useState(false);

    const deleteStudent = (idStudent) => {
        const subjects = students.filter(value => value._id !== idStudent);
        setStudents(subjects);
        setChanged(true);
    };

    const updateStudents = () => {
        setSaveChange(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/class/${currentClass._id}/students`,
                {
                    students: students
                },
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setStudents(res.data.students);
                setChanged(false);
            })
            .catch(err => {
                handleError(err);
            })
            .finally(() => {
                setSaveChange(false);
            })
    }

    const cancelChangeStudents = () => {
        setChanged(false);
        setReload(!reload);
    }

    useEffect(() => {
        const token = getCookie("token");
        setLoading(true);
        if (currentClass) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/admin/class/${currentClass._id}/students`, {
                    headers: {
                        Authorization: token,
                    },

                })
                .then(res => {
                    setStudents(res.data.students);
                })
                .catch(error => {
                    handleError(error)
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [currentClass, reload]);

    const [searchText, setSearchText] = useState("");

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
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
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
                return index + 1;
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
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Delete subject">
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
            title: `Do you want to delete this student "${record.firstName + " " + record.lastName}" from this class?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteStudent(record._id);
            },
        });
    }

    const handleError = (error) => {
        notify.notifyError("Error", error.message)
    }

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5"> <Text strong>{currentClass.name}</Text> - List students </Card.Title>
                            <Button type="primary"
                                style={{ float: 'right' }}
                                onClick={() => {
                                    setVisible(false);
                                }}
                            >Hide</Button>
                            <span className="d-block m-t-5"></span>
                            <Button type="primary" onClick={() => {
                                setModalVisible(true)
                            }}
                                icon={<PlusOutlined />}
                            >Add students</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered columns={columns}
                                dataSource={students}
                                pagination={
                                    {
                                        pageSize: 20,
                                        total: students.length,
                                        showQuickJumper: true,
                                        showTotal: total => `Total ${total} students`
                                    }}
                                loading={loading} />
                        </Card.Body>
                        {isChanged &&
                            <Card.Footer>
                                <Row style={{ float: 'right' }}>

                                    <Button
                                        style={{ marginRight: '10px' }}
                                        onClick={cancelChangeStudents}
                                    >Cancel</Button>

                                    <Button type="danger"
                                        loading={isSaveChange}
                                        onClick={updateStudents}
                                    >Save changes</Button>
                                </Row>
                            </Card.Footer>}
                    </Card>
                </Col>
            </Row>

            <ExcelStudentModal currentClass={currentClass} updateStudents={setStudents} visible={isModalVisible} setVisible={setModalVisible} />

        </Aux >
    );
}

export default StudentManager;