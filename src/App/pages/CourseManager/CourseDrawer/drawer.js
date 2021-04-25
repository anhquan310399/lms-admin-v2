/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Drawer, Form, Button, Input } from 'antd';
import { getCookie } from "../../../../services/localStorage.js";
import axios from "axios";
import * as notify from "../../../../services/notify";

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


const CourseDrawer = ({ visible, setVisible, course, setCourse, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onClose = () => {
        setCourse({});
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");
        if (!course._id) {
            createCourse(token, values);

        } else {
            updateCourse(token, values);
        }

    }

    const updateCourse = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/course/${course._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setLoading(false);
                setVisible(false);
                handleResponses("update", res.data.course);
                setCourse({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const createCourse = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/course/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleResponses("add", res.data.course);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            name: course?.name,
        })
    }, [course])

    return (
        <Button>
            <Drawer
                title={course._id ? "Update course" : "Create a new course"}
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

                        < Input placeholder="Enter name of course" />

                    </Form.Item>

                </Form>
            </Drawer>
        </Button>
    );
};


export default CourseDrawer;
