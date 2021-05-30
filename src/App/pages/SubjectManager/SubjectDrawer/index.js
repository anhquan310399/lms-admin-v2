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


const SubjectDrawer = ({ visible, setVisible, subject, setSubject, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onClose = () => {
        setSubject({});
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");
        if (!subject._id) {
            createSubject(token, values);

        } else {
            updateSubject(token, values);
        }

    }

    const updateSubject = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/subject/${subject._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setLoading(false);
                setVisible(false);
                handleResponses("update", res.data.subject);
                setSubject({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const createSubject = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/subject/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data.subject);
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleResponses("add", res.data.subject);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            name: subject?.name,
            code: subject?.code,
            credit: subject?.credit,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject])

    return (
        <Button>
            <Drawer
                title={subject._id ? "Update subject" : "Create a new subject"}
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
                        name={"credit"}
                        label="Credit">

                        < InputNumber min={1} defaultValue={1} placeholder="Enter credit of subject" />
                    </Form.Item>
                </Form>
            </Drawer>
        </Button>
    );
};


export default SubjectDrawer;
