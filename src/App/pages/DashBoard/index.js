import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

import Aux from "../../../hoc/_Aux";

import { getCookie } from '../../../services/localStorage';
import * as notify from '../../../services/notify';
import axios from 'axios';

const Dashboard = (props) => {

    const [statistic, setStatistic] = useState({});
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/admin/statistic`,
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            }
        ).then(res => {
            setStatistic(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const [onlineUsers, setOnlineUsers] = useState({
        online: 'NaN',
        percent: 0
    });

    const socket = props.socket;

    const setupSocket = () => {
        if (socket) {
            socket.emit("join-admin");
            socket.on("countUsers", (res) => {
                setOnlineUsers(res);
            })
        }
    };

    React.useEffect(() => {
        setupSocket();
        //eslint-disable-next-line
    }, [socket]);

    return (
        <Aux>
            <Row>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Teachers</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-users text-c-green f-30 m-r-5" /> {statistic.teachers?.amount} users</h3>
                                </div>

                                <div className="col-3 text-right">
                                    <p className="m-b-0">{statistic.teachers?.percent}%</p>
                                </div>
                            </div>
                            <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: `${statistic.teachers?.percent}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Students</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-users text-c-green f-30 m-r-5" /> {statistic.students?.amount} users</h3>
                                </div>

                                <div className="col-3 text-right">
                                    <p className="m-b-0">{statistic.students?.percent}%</p>
                                </div>
                            </div>
                            <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div className="progress-bar progress-c-theme2" role="progressbar" style={{ width: `${statistic.students?.percent}%` }} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <h6 className='mb-4'>Registers</h6>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-users text-c-green f-30 m-r-5" /> {statistic.registers?.amount} users</h3>
                                </div>

                                <div className="col-3 text-right">
                                    <p className="m-b-0">{statistic.registers?.percent}%</p>
                                </div>
                            </div>
                            <div className="progress m-t-30" style={{ height: '7px' }}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: `${statistic.registers?.percent}%` }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={8}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Recent Register Users</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>
                                    {statistic.newUsers?.map((user) => {
                                        return (
                                            <tr className="unread" key={user._id}>
                                                <td><img className="rounded-circle" style={{ width: '40px' }} src={user.urlAvatar} alt="activity-user" /></td>
                                                <td>
                                                    <h6 className="mb-1">{user.fullName}</h6>
                                                    <p className="m-0">{user.emailAddress}</p>
                                                </td>
                                                <td>
                                                    <h6 className="text-muted">
                                                        {user.status === 'activated' ?
                                                            <i className="fa fa-circle text-c-green f-10 m-r-15" /> :
                                                            <i className="fa fa-circle text-c-red f-10 m-r-15" />}
                                                        {user.createdAt}
                                                    </h6>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card className='card-event'>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center">
                                <div className="col">
                                    <h5 className="m-0">Online Users</h5>
                                </div>
                                <div className="col-auto">
                                    <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{onlineUsers?.percent}%</label>
                                </div>
                            </div>
                            <h2 className="mt-2 f-w-300">{onlineUsers?.online}<sub className="text-muted f-14">Users</sub></h2>
                            <i className="fa fa-angellist text-c-purple f-50" />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body className='border-bottom'>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-zap f-30 text-c-green" />
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{statistic?.publicSubjects}</h3>
                                    <span className="d-block text-uppercase">total public subjects</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-map-pin f-30 text-c-blue" />
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{statistic?.privateSubjects}</h3>
                                    <span className="d-block text-uppercase">total private subjects</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
}

export default Dashboard;