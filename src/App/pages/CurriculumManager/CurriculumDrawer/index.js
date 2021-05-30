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

const CurriculumDrawer = ({ visible, setVisible, curriculum, setCurriculum, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [subjects, setSubjects] = useState([]);

    const [faculties, setFaculties] = useState([]);

    const getListSubjects = (token) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/subject`,
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                setSubjects(res.data.subjects);
            })
            .catch(err => {

            });
    }

    const getListFaculties = (token) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/faculty`,
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                setFaculties(res.data.faculties);
            })
            .catch(err => {

            });
    }

    useEffect(() => {
        const token = getCookie("token");
        getListSubjects(token);
        getListFaculties(token);
    }, [])

    const onClose = () => {
        setCurriculum({});
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");

        if (!curriculum._id) {
            createCurriculum(token, values);

        } else {
            updateCurriculum(token, values);
        }

    }

    const updateCurriculum = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/admin/curriculum/${curriculum._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                setLoading(false);
                setVisible(false);
                handleResponses("update", res.data.curriculum);
                setCurriculum({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const createCurriculum = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/curriculum/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleResponses("add", res.data.curriculum);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            name: curriculum?.name,
            code: curriculum?.code,
            idFaculty: curriculum?.idFaculty,
            classes: curriculum?.classes,
        })
    }, [curriculum])

    return (
        <Button>
            <Drawer
                title={curriculum._id ? "Update curriculum" : "Create a new curriculum"}
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

                        < Input placeholder="Enter name of curriculum" />

                    </Form.Item>

                    <Form.Item
                        name={"code"}
                        label="Code"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input placeholder="Enter code of curriculum" />

                    </Form.Item>


                    <Form.Item
                        name={"idFaculty"}
                        label="Faculty"
                        rules={[
                            {
                                required: true
                            }
                        ]}>
                        <Select
                            allowClear
                            placeholder="Select faculty of curriculum"
                        >
                            {faculties.map(faculty => {
                                return <Option key={faculty._id}>{faculty.name}</Option>
                            })}

                        </Select>

                    </Form.Item>

                    <Form.Item
                        name={"subjects"}
                        label="Subjects">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select subject of curriculum"
                        >
                            {subjects.map(subject => {
                                return <Option key={subject._id}>{subject.name}</Option>
                            })}

                        </Select>

                    </Form.Item>

                </Form>

            </Drawer>
        </Button>
    );
};


export default CurriculumDrawer;
