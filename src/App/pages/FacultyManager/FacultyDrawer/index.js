/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Drawer, Form, Button, Input, Select } from 'antd';
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
    // eslint-disable-next-line no-template-curly-in-string
    required: "${label} is required!",
};


const FacultyDrawer = ({ visible, setVisible, faculty, setFaculty, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [curriculums, setCurriculums] = useState([]);

    useEffect(() => {
        const token = getCookie("token");
        setLoading(true);
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/curriculum`,
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                setLoading(false);
                setCurriculums(res.data.curriculums);
            })
            .catch(err => {

            });
    }, [])

    const onClose = () => {
        setFaculty({});
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");

        if (!faculty._id) {
            createFaculty(token, values);

        } else {
            updateFaculty(token, values);
        }

    }

    const updateFaculty = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/faculty/${faculty._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setLoading(false);
                setVisible(false);
                handleResponses("update", res.data.faculty);
                setFaculty({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const createFaculty = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/faculty/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleResponses("add", res.data.faculty);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            name: faculty?.name,
            code: faculty?.code,
            curriculums: faculty?.curriculums,
        })
    }, [faculty])

    return (
        <Button>
            <Drawer
                title={faculty._id ? "Update faculty" : "Create a new faculty"}
                width={500}
                onClose={onClose}
                closable={false}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="frm" htmlType="submit" type="primary" loading={loading}>
                            Submit</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    id="frm"
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

                        < Input placeholder="Enter name of faculty" />

                    </Form.Item>

                    <Form.Item
                        name={"code"}
                        label="Code"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input placeholder="Enter code of faculty" />

                    </Form.Item>

                    <Form.Item
                        name={"curriculums"}
                        label="Curriculums">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select curriculums of faculty"
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


export default FacultyDrawer;
