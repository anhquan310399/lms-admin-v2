import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Drawer, Form, Button, Input, Select, InputNumber } from 'antd';
import { getCookie } from "../../../../services/localStorage.js";
import axios from "axios";
import * as notify from "../../../../services/notify";

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


const SubjectDrawer = ({ visible, setVisible, cls, setClass, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onClose = () => {
        setClass({});
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");
        if (!cls._id) {
            createClass(token, values);

        } else {
            updateClass(token, values);
        }

    }

    const [curriculums, setCurriculums] = useState([]);

    const getListCurriculum = (token) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/curriculum`,
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                setCurriculums(res.data.curriculums);
            })
            .catch(err => {

            });
    }

    useEffect(() => {
        const token = getCookie("token");
        getListCurriculum(token);
    }, [])

    const updateClass = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/class/${cls._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setLoading(false);
                setVisible(false);
                handleResponses("update", res.data.class);
                setClass({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const createClass = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/class/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data.subject);
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleResponses("add", res.data.class);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            name: cls?.name,
            code: cls?.code,
            idCurriculum: cls?.idCurriculum
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cls])

    return (
        <Button>
            <Drawer
                title={cls._id ? "Update class" : "Create a new class"}
                width={500}
                onClose={onClose}
                closable={false}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="subjectForm" htmlType="submit" type="primary" loading={loading}>
                            Submit</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    id="subjectForm"
                    {...layout}
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name={"name"}
                        label="Name"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input placeholder="Enter name of subject" />

                    </Form.Item>

                    <Form.Item
                        name={"code"}
                        label="Code"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input placeholder="Enter code of subject" />
                    </Form.Item>

                    <Form.Item
                        name={"idCurriculum"}
                        label="Curriculum"
                        rules={[
                            {
                                required: true
                            }
                        ]}>
                        <Select
                            allowClear
                            placeholder="Select curriculum of class"
                        >
                            {curriculums.map(curriculum => {
                                return <Option key={curriculum._id}>{curriculum.name}</Option>
                            })}

                        </Select>

                    </Form.Item>

                </Form>
            </Drawer>
        </Button>
    );
};


export default SubjectDrawer;
