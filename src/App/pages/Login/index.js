import React, { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Button, Input, Divider, Col, Row } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import './../../../assets/scss/style.scss';
import Facebook from '../../../assets/images/facebook.svg'
import Google from '../../../assets/images/google.svg'
import Logo from '../../../assets/images/logo.svg'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../../../assets/common/constants/SocialKeys'
import axios from "axios";
import { authenticate, isAuth } from "../../../services/localStorage.js";
import 'antd/dist/antd.css'
import * as notify from '../../../services/notify';

import Aux from "../../../hoc/_Aux";

const Login = ({ history }) => {

    const [load, setLoad] = useState(false);

    const handleResponseLogin = (res) => {
        if (res.data.user.idPrivilege === 'admin') {
            authenticate(res, () => {
                const user = res.data.user;
                notify.notifySuccess(`Hey ${user.firstName + " " + user.lastName},`, `Welcome back!`)
                history.push("/");
            });
        } else {
            notify.notifyError("Error", 'PLease sign with account admin!');
        }
    }

    const handleLogin = async (values) => {
        setLoad(true);
        console.log(values);
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/authenticate`, {
                code: values.username,
                password: values.password,
            })
            .then((res) => {
                handleResponseLogin(res);
            })
            .catch((err) => {
                console.log(err.response);
                notify.notifyError("Error", err.response.data.message);
            })
            .finally(() => {
                setLoad(false);
            });
    }

    const responseGoogle = async (response) => {
        const token = response.tokenId;
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/auth/google`, {
                token,
            })
            .then((res) => {
                handleResponseLogin(res);
            })
            .catch((error) => {
                console.log(error.response);
                notify.notifyError("Error", error.response.data.message);
            });
    }

    const responseGoogleFailure = async (response) => {
        console.log('responseGoogleFailure', response);
    }

    const responseFacebook = async (response) => {
        const token = response.accessToken;
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/auth/facebook`, {
                token,
            })
            .then((res) => {
                handleResponseLogin(res);
            })
            .catch((error) => {
                console.log(error.response);
                notify.notifyError("Error", error.response.data.message);
            });

    }
    return (
        <Aux>
            {isAuth() ? <Redirect to="/" /> : null}
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
                            <div className="mb-4">
                                <i className="feather icon-unlock auth-icon" />
                            </div>
                            <h3 className="mb-4">Login</h3>
                            <Form
                                onFinish={handleLogin}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your username',
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Username" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your password',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        size='large'
                                        prefix={<KeyOutlined className="site-form-item-icon" />}
                                        placeholder="Password" />
                                </Form.Item>

                                <Form.Item
                                    style={{ textAlign: 'center' }}
                                >
                                    <Button loading={load} type="primary" htmlType="submit" size="large">
                                        Login</Button>
                                </Form.Item>
                            </Form>
                            <Divider>Or</Divider>
                            <Row>
                                <Col span={12} className="facebook-login">
                                    <FacebookLogin
                                        appId={FACEBOOK_CLIENT_ID}
                                        callback={responseFacebook}
                                        render={renderProps => (
                                            // eslint-disable-next-line jsx-a11y/alt-text
                                            <img className="button-google-login" style={{ cursor: "pointer" }} src={Facebook} onClick={() => renderProps.onClick()} disabled={renderProps.disabled} />
                                        )}
                                    />

                                </Col>
                                <Col span={12} className="google-login">
                                    <GoogleLogin clientId={GOOGLE_CLIENT_ID}
                                        render={renderProps => (
                                            // eslint-disable-next-line jsx-a11y/alt-text
                                            <img className="button-google-login" style={{ cursor: "pointer" }} src={Google} onClick={() => renderProps.onClick()} disabled={renderProps.disabled} />
                                        )}
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogleFailure}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </Col>
                            </Row>

                            <p className="mb-2 text-muted mt-4">Forgot password? <NavLink to="/forgot">Reset</NavLink></p>

                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
}

export default Login;