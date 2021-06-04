import React, { useEffect, useState } from "react";
import { getCookie, getLocalStorage, updateUser } from "../../../services/localStorage.js";
import axios from "axios";
import 'antd/dist/antd.css';
import './style.css';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import * as notify from '../../../services/notify';
import Aux from "../../../hoc/_Aux";
import { Card, Col, Row, } from 'react-bootstrap';
import { Divider, Avatar, Form, Input, Button, Tag } from 'antd';

import {
    FacebookOutlined,
    DisconnectOutlined
} from '@ant-design/icons';
const SectionDescription = ({ title, content }) => (
    <div>
        <p className="section-description-title">{title}:</p>
        <p className="section-description-content">{content}</p>
    </div>
);

const Manager = ({ history}) => {
    const [formPassword] = Form.useForm();
    const [formProfile] = Form.useForm();

    const [, forceUpdate] = useState(); // To disable submit button at the beginning.

    const [user, setUser] = useState(JSON.parse(getLocalStorage('user')));

    useEffect(() => {
        forceUpdate({});
        formProfile.setFieldsValue({
            emailAddress: user.emailAddress,
            lastName: user.lastName,
            firstName: user.firstName
        });
    }, []);

    const [submitProfile, setSubmitProfile] = useState(false);
    const [submitPassword, setSubmitPassword] = useState(false);

    const [connectFacebook, setConnectFacebook] = useState(false);
    const [disconnectFacebook, setDisconnectFacebook] = useState(false);

    const onFinishPassword = (values) => {
        console.log('password:', values);
        const data = {
            password: values.current,
            newPassword: values.new
        }
        setSubmitPassword(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/password`, data, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                formPassword.resetFields();
                notify.notifySuccess.success(res.data.message);
                setSubmitPassword(false);
            }).catch(error => {
                handleError(error);
                setSubmitPassword(false);
            });
    };

    const onFinishProfile = (values) => {
        console.log('profile:', values);
        const profile = {
            lastName: values.lastName,
            firstName: values.firstName
        }

        updateProfile(profile);
    };

    const updateProfile = (profile) => {
        setSubmitProfile(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/`, profile, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                notify.notifySuccess(res.data.message);
                updateUser(res.data.user);
                setUser(res.data.user);
                setSubmitProfile(false);
            }).catch(error => {
                handleError(error);
                setSubmitProfile(false);
            });
    }

    const linkFacebook = (response) => {
        setConnectFacebook(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/auth/facebook/link`,
                {
                    token: response.accessToken
                },
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                notify.notifySuccess(res.data.message);
                updateUser(res.data.user);
                setUser(res.data.user);
                setConnectFacebook(false);
            }).catch(error => {
                handleError(error);
                setConnectFacebook(false);
            });
    };

    const unlinkFacebook = () => {
        setDisconnectFacebook(true);
        const token = getCookie("token");
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/auth/facebook/unlink`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                notify.notifySuccess(res.data.message);
                updateUser(res.data.user);
                setUser(res.data.user);
                setDisconnectFacebook(false);
            }).catch(error => {
                handleError(error);
                setDisconnectFacebook(false);
            });
    };

    const handleError = (error) => {
        if (error.response?.status === 401) {
            history.push("/login");
            notify.notifyError("Your token is expired. Please login again");
        } else {
            console.log(error.response);
            notify.notifyError(error.response?.data?.message || error.message);
        }
    }

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Divider />
                            <Row>
                                <Col xs={5}>
                                    <SectionDescription title="Profile" content="Your email address is your identity on LMS ADMIN and is used to log in." />
                                </Col>
                                <Col xs={1}>
                                    <Avatar size={48} src={user.urlAvatar} />
                                </Col>
                                <Col xs={5}>
                                    <Form
                                        id="form-profile"
                                        name="form-profile"
                                        form={formProfile}
                                        layout="vertical"
                                        className="form-profile"
                                        onFinish={onFinishProfile}
                                        requiredMark={"optional"}
                                    >
                                        <Form.Item
                                            label="Email"
                                            name={"emailAddress"}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="First Name"
                                            name={"firstName"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your first name!',
                                                }
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Last name"
                                            name={"lastName"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your last name!',
                                                }
                                            ]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button style={{ marginTop: 8 }}
                                                type="primary"
                                                htmlType="submit"
                                                form="form-profile"
                                                loading={submitProfile}
                                            >Save</Button>

                                        </Form.Item>

                                    </Form>

                                    <Divider>Social Network</Divider>
                                    {!user.facebookId ? (<FacebookLogin
                                        appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                                        autoLoad={false}
                                        callback={linkFacebook}
                                        render={(renderProps) => (
                                            <Button
                                                style={{ color: '#131394' }}
                                                loading={connectFacebook}
                                                onClick={renderProps.onClick}
                                                icon={<FacebookOutlined />}
                                            >
                                                Connect to Facebook
                                            </Button>
                                        )}
                                    />) : (<Row>
                                        <Tag icon={<FacebookOutlined />} color="#3b5999">Facebook</Tag>
                                        <Tag color="purple">ID: {user.facebookId}</Tag>
                                        <Button
                                            size={"small"}
                                            style={{ marginLeft: 8 }}
                                            type={"primary"}
                                            danger
                                            icon={<DisconnectOutlined />}
                                            loading={disconnectFacebook}
                                            onClick={unlinkFacebook}
                                        >
                                            Unlink Facebook
                        </Button>
                                    </Row>)}
                                </Col>
                            </Row>

                            <Divider />
                            <Row>
                                <Col xs={5}>
                                    <SectionDescription title="Password" content="Changing your password will also required your current password" />
                                </Col>
                                <Col xs={1} />
                                <Col xs={6}>
                                    <Form
                                        onFinish={onFinishPassword}
                                        name="password"
                                        id='form-password'
                                        form={formPassword}
                                        layout="vertical"
                                        className="form-password"
                                        requiredMark={"optional"}
                                    >
                                        <Form.Item
                                            label="Current password"
                                            name="current"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your current password!',
                                                }
                                            ]}
                                            hasFeedback>
                                            <Input.Password placeholder="enter your current password" />
                                        </Form.Item>
                                        <Divider />
                                        <Form.Item
                                            label="New password"
                                            name="new"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your new password!',
                                                },
                                                {
                                                    min: 8,
                                                    message: 'Password must be 8 or more characters.'
                                                }
                                            ]}
                                            hasFeedback
                                        >
                                            <Input.Password
                                                placeholder="enter a new password" />
                                        </Form.Item>
                                        <Form.Item
                                            name="confirm"
                                            dependencies={['new']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please confirm your password!',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(rule, value) {
                                                        if (!value || getFieldValue('new') === value) {
                                                            return Promise.resolve();
                                                        }

                                                        return Promise.reject('The two passwords that you entered do not match!');
                                                    },
                                                }),
                                            ]}
                                            label="Confirm New Password">
                                            <Input.Password placeholder="enter the password again" />
                                        </Form.Item>
                                        <Form.Item shouldUpdate={true}>
                                            {() => (
                                                <Button style={{ marginTop: 8 }}
                                                    loading={submitPassword}
                                                    htmlType="submit"
                                                    form='form-password'
                                                    disabled={
                                                        !formPassword.isFieldsTouched(true) ||
                                                        formPassword.getFieldsError().filter(({ errors }) => errors.length).length
                                                    }
                                                >Update password</Button>
                                            )}
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
};

export default Manager;