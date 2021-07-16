import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Row, Col } from 'react-bootstrap';
import { Drawer, Form, Button, Input, Select, Divider } from 'antd';
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


const CourseDrawer = ({ visible, setVisible, course, setCourse, handleResponses }) => {
    const [loading, setLoading] = useState(false);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [loadingFaculties, setLoadingFaculties] = useState(true);
    const [loadingCurriculums, setLoadingCurriculums] = useState(false);
    const [loadingCurriculumElements, setLoadingCurriculumElements] = useState(false);

    const [form] = Form.useForm();

    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);

    const [isPrivate, setPrivate] = useState(true);

    const onClose = () => {
        setCourse({});
        form.resetFields();
        setVisible(false);
        setPrivate(true);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");
        if (!course?._id) {
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
                setVisible(false);
                handleResponses("update", res.data.course);
                setCourse({});
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
            }).finally(() => {
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
            })
            .finally(() => {
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

                setTeachers(res.data.users);
            })
            .catch(error => {
                console.log(error.response);
                notify.notifyError("Error!", error?.response?.data?.message)
            })
            .finally(() => {
                setLoadingTeachers(false);
            });
    }

    const getSemesters = () => {
        setLoadingSemesters(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/semester/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setSemesters(res.data.semesters);
            })
            .catch(error => {
                notify.notifyError("Error!", error.response.data.message)
            }).finally(() => {
                setLoadingSemesters(false);
            });
    }

    const getFaculties = () => {
        setLoadingFaculties(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/faculty/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {

                setFaculties(res.data.faculties);
            })
            .catch(error => {
                notify.notifyError("Error!", error.response.data.message)
            })
            .finally(() => {
                setLoadingFaculties(false);
            });
    }

    const getCurriculums = (idFaculty) => {
        setLoadingCurriculums(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/faculty/${idFaculty}/curriculums`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {

                setCurriculums(res.data.curriculums);
            })
            .catch(error => {
                notify.notifyError("Error!", error.response.data.message)
            })
            .finally(() => {
                setLoadingCurriculums(false);
            });
    }

    const getElementsOfCurriculum = (idCurriculum) => {
        setLoadingCurriculumElements(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/curriculum/${idCurriculum}/elements`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {

                setSubjects(res.data.subjects);
                setClasses(res.data.classes);
            })
            .catch(error => {
                notify.notifyError("Error!", error.response.data.message)
            })
            .finally(() => {
                setLoadingCurriculumElements(false);
            });
    }

    useEffect(() => {
        getTeachers();
        getSemesters();
        getFaculties();
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            name: course?.name,
            idTeacher: course?.teacher?._id,
            idSemester: course?.idSemester,
            config: course?.config,
        })
        if (course?.config) {
            console.log(course);
            setPrivate(course.config.role === 'private');
        } else {
            setPrivate(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [course])

    return (
        <Button>
            <Drawer
                title={course?._id ? "Update course" : "Create a new course"}
                width={900}
                onClose={onClose}
                closable={false}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="courseForm" htmlType="submit" type="primary" loading={loading}>
                            Submit</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    id="courseForm"
                    {...layout}
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Row>
                        <Col>
                            <Divider orientation="left">Info</Divider>
                            {course?._id &&
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
                            }
                            <Form.Item
                                name={"idTeacher"}
                                label="Teacher"
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}>
                                <Select
                                    showSearch
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

                            {isPrivate &&
                                <Form.Item
                                    name={"idSemester"}
                                    label="Semester"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}>
                                    <Select
                                        showSearch
                                        placeholder="Select semester"
                                        optionFilterProp="children"
                                        loading={loadingSemesters}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {semesters.map(value => {
                                            return <Option key={value._id} value={value._id}>{value.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        </Col>
                        <Col >
                            <Divider orientation="left">Configuration</Divider>
                            <Form.Item
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
                                    onChange={(value)=>{
                                        setPrivate(value==='private');
                                    }}
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
                        </Col>
                    </Row>

                    {!course?._id &&
                        <Row>
                            <Divider >Curriculum Configuration</Divider>
                            <Col>
                                <Form.Item
                                    name={"idFaculty"}
                                    label="Faculty"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}>
                                    <Select
                                        onChange={(value) => { getCurriculums(value) }}
                                        showSearch
                                        placeholder="Select faculty"
                                        optionFilterProp="children"
                                        loading={loadingFaculties}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {faculties.map(value => {
                                            return <Option key={value._id} value={value._id}>{value.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    name={"idSubject"}
                                    label="Subject"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}>
                                    <Select
                                        showSearch
                                        placeholder="Select subject"
                                        optionFilterProp="children"
                                        loading={loadingCurriculumElements}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {subjects.map(value => {
                                            return <Option key={value._id} value={value._id}>{value.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name={"idCurriculum"}
                                    label="Curriculum"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}>
                                    <Select
                                        showSearch
                                        onChange={(value) => { getElementsOfCurriculum(value) }}
                                        placeholder="Select curriculum"
                                        optionFilterProp="children"
                                        loading={loadingCurriculums}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {curriculums.map(value => {
                                            return <Option key={value._id} value={value._id}>{value.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    name={"idClass"}
                                    label="Class"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}>
                                    <Select
                                        showSearch
                                        placeholder="Select class"
                                        optionFilterProp="children"
                                        loading={loadingCurriculumElements}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {classes.map(value => {
                                            return <Option key={value._id} value={value._id}>{value.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                    }
                </Form>
            </Drawer>
        </Button>
    );
};


export default CourseDrawer;
