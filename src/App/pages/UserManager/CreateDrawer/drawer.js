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


const CreateUserDrawer = ({ role, visible, setVisible, handleAddResponses }) => {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const [privileges, setPrivileges] = useState([]);

    const [loadingPrivileges, setLoadingPrivileges] = useState(true);

    const onClose = () => {
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const token = getCookie("token");
        createUser(token, values);
    }

    const createUser = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/admin/user/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message)
                setLoading(false);
                handleAddResponses(res.data.user);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                notify.notifyError("Error!", error.response.data.message)
                setLoading(false);
            });
    }

    const getPrivileges = () => {
        setLoadingPrivileges(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/admin/privilege/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setLoadingPrivileges(false);
                setPrivileges(res.data.privileges);
            })
            .catch(error => {
                console.log(error.response);
                notify.notifyError("Error!", error.response.data.message)
            });
    }


    useEffect(() => {
        getPrivileges();
        form.setFieldsValue({
            idPrivilege: role
        })
    }, [role])

    return (
        <Button>
            <Drawer
                title={`Create a new ${role}`}
                width={500}
                onClose={onClose}
                closable={false}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="formDrawer" htmlType="submit" type="primary" loading={loading}>
                            Submit</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    id="formDrawer"
                    {...layout}
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name={"code"}
                        label="Code"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input placeholder="Enter code of user"/>

                    </Form.Item>
                    <Form.Item
                        name={"firstName"}
                        label="First Name"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        < Input placeholder="Enter first name"/>
                    </Form.Item>

                    <Form.Item
                        name={"lastName"}
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        < Input placeholder="Enter last name"/>
                    </Form.Item>
                    <Form.Item
                        name={"emailAddress"}
                        label="Email Address"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        < Input placeholder="Enter email address"/>
                    </Form.Item>

                    <Form.Item
                        name={"idPrivilege"}
                        label="idPrivilege"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            disabled
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a privilege"
                            optionFilterProp="children"
                            loading={loadingPrivileges}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {privileges.map(value => {
                                return <Option key={value._id} value={value.role}>{value.name}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name={"status"}
                        label="Status"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select Status"
                        >
                            <Option key='activated' value='activated'>Activated</Option>
                            <Option key='not_activated' value='not_private'>Not Activated</Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Drawer>
        </Button>
    );
};


export default CreateUserDrawer;
