import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { getCookie, getLocalStorage } from '../../../../../../../../services/localStorage';

import Message from '../../../ChatList/Rooms/Chat/Message/Message';
import Aux from "../../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../../store/constant";
import { Spin, Row, Button } from 'antd';

import 'antd/dist/antd.css';

const NewContact = (props) => {
    const { socket, contact } = props;
    const [messageList, setMessageList] = useState([]);
    const currentUser = JSON.parse(getLocalStorage("user"));
    let messages = [];

    const [scrollCtrRef, setScrollCtrRef] = useState();
    // eslint-disable-next-line no-unused-vars
    const [scrollRef, setScrollRef] = useState();

    const [room, setRoom] = useState({});
    const [isLoading, setLoading] = useState(false);

    const makeNewContact = () => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/chatroom/`,
            {
                to: contact._id
            },
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            })
            .then(res => {
                const target = res.data.room;
                setRoom(target);
                socket.emit('join-chat', { chatroomId: target._id });
                socket.on("chatMessage", (message) => {
                    messages.push(message);
                    setMessageList([...messages]);
                    scrollToBottom();
                });
                props.removeContact(contact._id, target);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        return () => {
            resetAllComponent();
            socket.emit('leave-chat', { chatroomId: room._id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    const resetAllComponent = () => {
        setMessageList([]);
    }

    const scrollToBottom = () => {
        if (scrollCtrRef) {
            scrollCtrRef.scrollTop = scrollCtrRef.scrollHeight;
        }
    }

    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim().length > 0) {
            socket.emit("chat", { message: message, chatroomId: room._id })
        }

        setMessage("");
    }

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    }

    let newClass = ['header-chat'];
    if (props.newOpen && props.contactOpen) {
        newClass = [...newClass, 'open'];
    }

    const closeChat = () => {
        props.closed();
    }

    return (
        <Aux>
            <div className={newClass.join(' ')}>
                <div className="h-list-header">
                    <h6>{contact?.firstName + " " + contact?.lastName}</h6>
                    <a href={DEMO.BLANK_LINK} className="h-back-user-list" onClick={closeChat}><i className="feather icon-chevron-left" /></a>
                </div>
                <div className="h-list-body">
                    <div className="main-chat-cont">
                        <PerfectScrollbar
                            ref={ref => {
                                setScrollRef(ref);
                            }}
                            containerRef={ref => {
                                setScrollCtrRef(ref);
                            }}>
                            <div className="main-friend-chat">

                                {isLoading &&
                                    <Row justify="center">
                                        <Spin tip="Loading..."></Spin>
                                    </Row>}
                                {
                                    !room._id &&
                                    <div className="media chat-messages text-center">
                                        <div className="media-body chat-menu-content">
                                            <div className="">
                                                <p className="chat-cont">Send any message to make new contact</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {(messageList?.length === 0 && room._id)
                                    &&
                                    <div className="media chat-messages text-center">
                                        <div className="media-body chat-menu-content">
                                            <div className="">
                                                <p className="chat-cont">Say hello to new friend</p>
                                            </div>
                                        </div>
                                    </div>}
                                {
                                    messageList?.length > 0 && messageList.map((message) => {
                                        return <Message key={message._id} message={message} user={currentUser} />;
                                    })

                                }
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                <div className="h-list-footer">

                    {room._id ?
                        <div className="input-group">
                            <input type="file" className="chat-attach" style={{ display: 'none' }} />
                            <a href={DEMO.BLANK_LINK} className="input-group-prepend btn btn-success btn-attach">
                                <i className="feather icon-paperclip" />
                            </a>
                            <input
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                                value={message}
                                onChange={handleChangeMessage}
                                type="text" name="h-chat-text"
                                className="form-control h-send-chat"
                                placeholder="Write hear . . " />
                            <button
                                onClick={sendMessage}
                                type="submit"
                                className="input-group-append btn-send btn btn-primary">
                                <i className="feather icon-message-circle" />
                            </button>
                        </div>
                        :
                        <Row justify="center">
                            <Button
                                type="primary"
                                shape="round"
                                loading={isLoading}
                                block
                                onClick={makeNewContact}>
                                Make new contact
                            </Button>
                        </Row>
                    }

                </div>
            </div>
        </Aux>
    );
};

export default NewContact;