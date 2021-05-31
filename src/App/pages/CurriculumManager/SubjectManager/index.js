import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Typography, Tooltip, Select, Form, Input } from 'antd';
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

const { confirm } = Modal;
const { Text } = Typography;
const { Option } = Select;


const layout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    }
};

const validateMessages = {
    required: "${label} is required!",
};

const SubjectManager = ({ curriculum, visible, setVisible }) => {

    const [currentSubjects, setCurrentSubjects] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    const [others, setOthers] = useState([]);

    const [form] = Form.useForm();

    const [isChanged, setChanged] = useState(false);

    const [reload, setReload] = useState(false);

    const deleteSubject = (subject) => {
        setChanged(true);
        const subjects = currentSubjects.filter(value => value._id !== subject._id);
        console.log(subjects);
        setCurrentSubjects(subjects);
        setOthers([...others, subject]);
    };

    const updateSubjects = () => {
        setLoading(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/curriculum/${curriculum._id}/subjects`,
                {
                    subjects: currentSubjects
                },
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setCurrentSubjects(res.data.subjects);
                setOthers(res.data.others);
                setChanged(false);
            })
            .catch(err => {
                handleError(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        const token = getCookie("token");
        setLoading(true);
        if (curriculum) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/admin/curriculum/${curriculum._id}/subjects`, {
                    headers: {
                        Authorization: token,
                    },

                })
                .then(res => {
                    setCurrentSubjects(res.data.subjects);
                    setOthers(res.data.others);
                })
                .catch(error => {
                    handleError(error)
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [reload,curriculum]);

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
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
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
            title: `Do you want to delete this subject "${record.name}" from this curriculum?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteSubject(record);
            },
        });
    }

    const handleError = (error) => {
        notify.notifyError("Error", error.message)
    }

    const onCloseModal = () => {
        form.resetFields();
        setModalVisible(false);
    }

    const addSubjects = (values) => {
        setChanged(true);
        const subjects = others.filter(value => values.subjects.includes(value._id));
        setOthers(others.filter(value => !subjects.includes(value)));
        setCurrentSubjects([...subjects, ...currentSubjects]);
        onCloseModal();
    }

    const cancelChangeSubjects = () => {
        setChanged(false);
        setReload(!reload);
    }

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5"> <Text strong>{curriculum.name}</Text> - List subjects </Card.Title>
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
                            >Add subject</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                bordered columns={columns}
                                dataSource={currentSubjects}
                                pagination={
                                    {
                                        pageSize: 20,
                                        total: currentSubjects.length,
                                        showQuickJumper: true,
                                        showTotal: total => `Total ${total} subjects`
                                    }}
                                loading={loading} />
                        </Card.Body>

                        {isChanged &&
                            <Card.Footer>
                                <Row style={{ float: 'right' }}>

                                    <Button
                                        style={{ marginRight: '10px' }}
                                        onClick={cancelChangeSubjects}
                                    >Cancel</Button>

                                    <Button type="danger"
                                        loading={loading}
                                        onClick={updateSubjects}
                                    >Save changes</Button>
                                </Row>
                            </Card.Footer>}
                    </Card>
                </Col>
            </Row>

            <Modal title="Add Subjects" visible={isModalVisible}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onCloseModal} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="subjectForm" htmlType="submit" type="primary">
                            Submit</Button>
                    </div>
                }
                onCancel={onCloseModal}>
                <Form
                    form={form}
                    id="subjectForm"
                    {...layout}
                    validateMessages={validateMessages}
                    onFinish={addSubjects}
                >


                    <Form.Item
                        name={"subjects"}
                        label="Subjects"
                        rules={[
                            {
                                required: true
                            }
                        ]}>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select subjects to add to curriculum"
                        >
                            {others.map(subject => {
                                return <Option key={subject._id}>{subject.name}</Option>
                            })}

                        </Select>

                    </Form.Item>

                </Form>
            </Modal>
        </Aux >
    );
}

export default SubjectManager;