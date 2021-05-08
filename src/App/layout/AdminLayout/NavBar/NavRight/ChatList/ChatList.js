import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Rooms from './Rooms/Rooms';
import Aux from "../../../../../../hoc/_Aux";
import DEMO from "../../../../../../store/constant";
import { Input } from 'antd';
import Contacts from './Contacts/Contacts';
import axios from 'axios';
import { getCookie } from '../../../../../../services/localStorage';
const { Search } = Input;

const ChatList = (props) => {
    let listClass = ['header-user-list'];
    if (props.listOpen) {
        listClass = [...listClass, 'open'];
    }

    const [rooms, setRooms] = useState([]);

    const getChatRooms = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/chatroom/`, {
            headers: {
                'Authorization': getCookie("token")
            }
        })
            .then(res => {
                setRooms(res.data.rooms);
            })
            .catch(error => {
                console.log(error);
            })
    }
    useEffect(() => {
        getChatRooms();
    }, [])

    const [contactOpen, setContactOpen] = useState(false);

    return (
        <Aux>
            <div className={listClass.join(' ')}>
                <div className="h-list-header">
                    <Search placeholder="Search ..." allowClear enterButton onClick={() => {
                        setContactOpen(true);
                    }} />
                </div>
                <div className="h-list-body">
                    <a href={DEMO.BLANK_LINK} className="h-close-text" onClick={props.closed}><i className="feather icon-chevrons-right" /></a>
                    <div className="main-friend-cont scroll-div">
                        <div className="main-friend-list" style={{ height: 'calc(100vh - 85px)' }}>
                            <PerfectScrollbar>
                                <Rooms rooms={rooms} listOpen={props.listOpen} socket={props.socket} />
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>

            <Contacts contactOpen={contactOpen} listOpen={props.listOpen} socket={props.socket} closed={() => {
                setContactOpen(false);
            }}
                addRoom={(room) => {
                    setRooms([...rooms, room]);
                }} />
        </Aux>
    );
};

export default ChatList;