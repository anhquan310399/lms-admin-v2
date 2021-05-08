import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import ChatList from './ChatList/ChatList';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
import Avatar3 from '../../../../../assets/images/user/avatar-3.jpg';

import { signOut } from '../../../../../services/localStorage';
import * as notify from '../../../../../services/notify';
import { getLocalStorage } from '../../../../../services/localStorage';
import { useHistory } from 'react-router-dom';

const NavRight = ({ rtlLayout, socket }) => {

    const [listOpen, setListOpen] = useState(false);
    const history = useHistory();

    const [account, setAccount] = useState({});
    useEffect(() => {
        const user = JSON.parse(getLocalStorage("user"));
        console.log(getLocalStorage("user"));
        setAccount(user);
    }, [])

    const infoAccount = (
        <div className="pro-head">
            <img src={account?.urlAvatar} className="img-radius" alt="User Profile" />
            <span>{account?.firstName + " " + account.lastName}</span>
            <a
                href="#!"
                title="Logout"
                className="dud-logout"
                onClick={() => {
                    signOut(() => {
                        notify.notifySuccess("Success", "See you later!");
                        history.push("/login");
                    });
                }}>
                <i className="feather icon-log-out" />
            </a>
        </div>
    )
    return (
        <Aux>
            <ul className="navbar-nav ml-auto">
                {/* Notification */}
                <li>
                    <Dropdown alignRight={!rtlLayout}>
                        <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                            <i className="icon feather icon-bell" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight className="notification">
                            <div className="noti-head">
                                <h6 className="d-inline-block m-b-0">Notifications</h6>
                                <div className="float-right">
                                    <a href={DEMO.BLANK_LINK} className="m-r-10">mark as read</a>
                                    <a href={DEMO.BLANK_LINK}>clear all</a>
                                </div>
                            </div>
                            <ul className="noti-body">
                                <li className="n-title">
                                    <p className="m-b-0">NEW</p>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src={Avatar1} alt="Generic placeholder" />
                                        <div className="media-body">
                                            <p><strong>John Doe</strong><span className="n-time text-muted"><i
                                                className="icon feather icon-clock m-r-10" />30 min</span></p>
                                            <p>New ticket Added</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="n-title">
                                    <p className="m-b-0">EARLIER</p>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src={Avatar2} alt="Generic placeholder" />
                                        <div className="media-body">
                                            <p><strong>Joseph William</strong><span className="n-time text-muted"><i
                                                className="icon feather icon-clock m-r-10" />30 min</span></p>
                                            <p>Prchace New Theme and make payment</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src={Avatar3} alt="Generic placeholder" />
                                        <div className="media-body">
                                            <p><strong>Sara Soudein</strong><span className="n-time text-muted"><i
                                                className="icon feather icon-clock m-r-10" />30 min</span></p>
                                            <p>currently login</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="noti-footer">
                                <a href={DEMO.BLANK_LINK}>show all</a>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                {/* Show Message */}
                <li className={rtlLayout ? 'm-r-15' : 'm-l-15'}>
                    <a href={DEMO.BLANK_LINK} className="displayChatbox" onClick={() => { setListOpen(true); }}><i className="icon feather icon-mail" /></a>
                </li>

                {/* Show account properties */}
                <li>
                    <Dropdown alignRight={!rtlLayout} className="drp-user">
                        <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                            <i className="icon feather icon-settings" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight className="profile-notification">
                            {infoAccount}
                            <ul className="pro-body">
                                <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-settings" /> Settings</a></li>
                                <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-user" /> Profile</a></li>
                                <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-mail" /> My Messages</a></li>
                                <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-lock" /> Lock Screen</a></li>
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>

            
            <ChatList listOpen={listOpen} closed={() => { setListOpen(false); }} socket={socket} />
        </Aux>
    );
}

export default NavRight;
