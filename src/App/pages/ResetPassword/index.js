import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Button, Input, Alert } from 'antd'
import './../../../assets/scss/style.scss';
import axios from "axios";
import 'antd/dist/antd.css'
import * as notify from '../../../services/notify';

import Aux from "../../../hoc/_Aux";

const ResetPassword = (props) => {
    const [load, setLoad] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const { token } = props.match.params;

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/verify`,
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
            })
            .catch((error) => {
                props.history.push('/');
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleResetPassword = async (values) => {
        setLoad(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/password/reset`, {
                password: values.password,
            },
                {
                    headers: {
                        Authorization: token,
                    },
                })
            .then((res) => {
                notify.notifySuccess("Success", res.data.message);
                props.history.push('/');
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
            })
            .finally(() => {
                setLoad(false);
            });
    }

    return (
        <Aux>
            {!token &&
                <Redirect to="/" />
            }
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">

                            <h3 className="mb-4">Reset your password</h3>
                            {errorMessage &&
                                <Alert
                                    style={{ textAlign: 'start' }}
                                    description={errorMessage}
                                    type="error"
                                />
                            }
                            <br />
                            <Form
                                onFinish={handleResetPassword}
                            >
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="New password" />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('The confirm password do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm password" />
                                </Form.Item>

                                <Form.Item
                                    style={{ textAlign: 'right', marginTop: '20px' }}
                                >
                                    <Button
                                        disabled={errorMessage}
                                        loading={load} type="primary" htmlType="submit" size="large">
                                        Reset Password</Button>
                                </Form.Item>
                            </Form>

                            <p className="mb-2 text-muted mt-4">Have you requested? <NavLink to="/forgot">Forgot password</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
}

export default ResetPassword;