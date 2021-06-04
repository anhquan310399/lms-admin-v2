import React, { useState, useRef } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Modal, Space, Table, Button, Tooltip, Input } from 'antd';
import {
    ExclamationCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import * as notify from '../../../../../services/notify';
import { getCookie } from '../../../../../services/localStorage';
import axios from 'axios';

import XLSX from 'xlsx';

const { confirm } = Modal;

const ExcelStudentModal = ({ currentClass, updateStudents, visible, setVisible }) => {
    const [isLoadFile, setLoadFile] = useState(false);

    const [isAddStudent, setAddStudent] = useState(false);

    const [students, setStudents] = useState([]);

    const addStudents = () => {
        setAddStudent(true);
        const token = getCookie("token");
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/class/${currentClass._id}/students`,
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
                updateStudents(res.data.students);
                onCloseModal();
            })
            .catch(err => {
                notify.notifyError("Error", err.response.data.message)
            })
            .finally(() => {
                setAddStudent(false);
            })
    }

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

    const deleteStudent = (code) => {
        const list = students.filter(value => value.code !== code);

        setStudents(list)
    };

    const showConfirmDelete = (record) => {
        confirm({
            title: `Do you want to delete this student "${record.firstName + " " + record.lastName}" from this class?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteStudent(record.code);
            },
        });
    }

    const handleError = (error) => {
        notify.notifyError("Error", error.message)
    }

    const onCloseModal = () => {
        setVisible(false);
        setStudents([]);
        refFile.current.state.value = "";
    }

    const handleChange = (e) => {
        setStudents([]);
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                || file.type === "application/vnd.ms-excel") {

                const reader = new FileReader();
                const rABS = !!reader.readAsBinaryString;

                reader.onload = (e) => {
                    /* Parse data */
                    const bstr = e.target.result;
                    const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data = XLSX.utils.sheet_to_json(ws);
                    /* Update state */
                    setStudents(data);
                    setLoadFile(false);
                };

                if (rABS) {
                    reader.readAsBinaryString(file);
                    setLoadFile(true);
                } else {
                    reader.readAsArrayBuffer(file);
                    setLoadFile(true);
                };
            }
            else {
                notify.notifyError("Fail", "Invalid file type")
                refFile.current.state.value = "";
            }
        }
    };

    const refFile = useRef(null);

    return (

        <Modal title="Add Students" visible={visible}
            width="800px"
            footer={
                <div style={{ textAlign: 'right', }} >
                    <Button onClick={onCloseModal} style={{ marginRight: 8 }}>
                        Cancel</Button>
                    <Button
                        disabled={!students.length}
                        type="primary" onClick={addStudents} loading={isAddStudent}>
                        Submit</Button>
                </div>
            }
            onCancel={onCloseModal}>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Input ref={refFile} type="file" accept=".xlsx,.xls" onChange={handleChange} />

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
                                loading={isLoadFile} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Modal>

    );
}

export default ExcelStudentModal;