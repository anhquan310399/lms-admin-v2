/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-template-curly-in-string */
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
    required: "${label} is required!",
};


const SubjectDrawer = ({ visible, setVisible, subject, setSubject, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [form] = Form.useForm();

    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);

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

    const getTeachers = () => {
        setLoadingTeachers(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/user/teacher`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setLoadingTeachers(false);
                setTeachers(res.data.users);
            })
            .catch(error => {
                console.log(error.response);
                notify.notifyError("Error!", error?.response?.data?.message)
            });
    }

    const getCourses = () => {
        setLoadingCourses(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/course/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setLoadingCourses(false);
                setCourses(res.data.courses);
            })
            .catch(error => {
                console.log(error.response);
                notify.notifyError("Error!", error.response.data.message)
            });
    }

    useEffect(() => {
        getTeachers();
        getCourses();
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            name: subject?.name,
            idLecture: subject?.lecture?._id,
            idCourse: subject?.idCourse,
            config: subject?.config,
        })
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

                        < Input placeholder="Enter name of subject"/>

                    </Form.Item>
                    <Form.Item
                        name={"idLecture"}
                        label="Lecture"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a teacher"
                            optionFilterProp="children"
                            loading={loadingTeachers}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {teachers.map(value => {
                                let name = `${value.firstName} ${value.lastName}`;
                                return <Option key={value._id} value={value._id}>{name}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name={"idCourse"}
                        label="Course"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select course"
                            optionFilterProp="children"
                            loading={loadingCourses}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {courses.map(value => {
                                return <Option key={value._id} value={value._id}>{value.name}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        // name={["subject", "idLecture"]}
                        name={["config", "role"]}
                        label="Role"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select role"
                        >
                            <Option key='public' value='public'>Public</Option>
                            <Option key='private' value='private'>Private</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        // name={["subject", "idLecture"]}
                        name={["config", "acceptEnroll"]}
                        label="Accept Enroll"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select role"
                        >
                            <Option key='accept' value={true}>Accept</Option>
                            <Option key='deny' value={false}>Deny</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </Button>
    );
};


export default SubjectDrawer;
