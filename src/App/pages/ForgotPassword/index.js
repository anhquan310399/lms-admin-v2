import React, { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Button, Input, Alert, Row } from 'antd'
import { MailOutlined } from '@ant-design/icons';
import './../../../assets/scss/style.scss';
import axios from "axios";
import 'antd/dist/antd.css'
import * as notify from '../../../services/notify';

import Aux from "../../../hoc/_Aux";

const SearchAccount = () => {

    const [load, setLoad] = useState(false);

    const [errorMessage, setErrorMessage] = useState(false);

    const [isRequested, setRequested] = useState(false);

    const handleSearchAccount = async (values) => {
        setLoad(true);
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/password/forget`, {
                emailAddress: values.email,
            })
            .then((res) => {
                setRequested(true);
            })
            .catch((error) => {
                if (error.response.status !== 404) {
                    setRequested(true);
                }
                setErrorMessage(error.response.data.message);
            })
            .finally(() => {
                setLoad(false);
            });
    }

    return (
        <Aux>
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

                            <h3 className="mb-4">Find your account</h3>
                            {errorMessage &&
                                <Alert
                                    style={{ textAlign: 'start' }}
                                    description={errorMessage}
                                    type="error"
                                />
                            }

                            <p className="mb-2 mt-2">Please enter your email to find out your account!</p>
                            <Form
                                onFinish={handleSearchAccount}
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your email',
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        prefix={<MailOutlined className="site-form-item-icon" />}
                                        placeholder="Your email" />
                                </Form.Item>

                                <Form.Item
                                    style={{ textAlign: 'right' }}
                                >
                                    <Button
                                        disabled={isRequested}
                                        loading={load}
                                        type="primary"
                                        htmlType="submit"
                                        size="large">
                                        Send</Button>
                                </Form.Item>
                            </Form>

                            <p className="mb-2 text-muted mt-4">Go back? <NavLink to="/login">Login</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
}

export default SearchAccount;