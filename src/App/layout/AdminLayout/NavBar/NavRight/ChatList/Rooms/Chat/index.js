import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { getCookie, getLocalStorage } from '../../../../../../../../services/localStorage';

import Message from './Message';
import Aux from "../../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../../store/constant";
import { Spin, Row, Col } from 'antd';

import 'antd/dist/antd.css';

const ChatRoom = (props) => {
    const { socket } = props;
    const { room } = props;
    const [messageList, setMessageList] = useState([]);
    const currentUser = JSON.parse(getLocalStorage("user"));
    const [isLoadMessages, setLoadMessages] = useState(false);

    const getMessages = () => {
        setLoadMessages(true);
        axios.get(`${process.env.REACT_APP_API_URL}/chatroom/${room._id}`, {
            headers: {
                'Authorization': getCookie("token")
            }
        })
            .then(res => {
                setMessageList(res.data.room.messages);
                scrollToBottom();
            })
            .catch(error => {
                console.log(error);
            }).finally(() => {
                setLoadMessages(false);
            })
    }

    const [scrollCtrRef, setScrollCtrRef] = useState();
    // eslint-disable-next-line no-unused-vars
    const [scrollRef, setScrollRef] = useState();

    useEffect(() => {
        if (room._id) {
            getMessages();
            socket.emit('join-chat', { chatroomId: room._id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    const scrollToBottom = () => {
        if (scrollCtrRef) {
            scrollCtrRef.scrollTop = scrollCtrRef.scrollHeight;
        }
    }

    const handleLoadMoreMessages = () => {
        setLoadMessages(true);
        axios.post(`${process.env.REACT_APP_API_URL}/chatroom/${room._id}/messages`,
            {
                current: messageList.length
            },
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            })
            .then(res => {
                setMessageList([...res.data.messages, ...messageList]);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoadMessages(false);
            })
    }

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (message) => {
                setMessageList([...messageList, message]);
                scrollToBottom();
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageList])

    const [messageDisplay, setMessageDisplay] = useState(null);

    useEffect(() => {
        if (!messageList) {
            let message = (
                <div className="media chat-messages text-center">
                    <div className="media-body chat-menu-content">
                        <div className="">
                            <p className="chat-cont">Say hello to new friend</p>
                        </div>
                    </div>
                </div>
            );
            setMessageDisplay(message);
        } else {
            let message = messageList.map((message) => {
                return <Message key={message._id} message={message} user={currentUser} />;
            });
            setMessageDisplay(message);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageList])

    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim().length > 0) {
            socket.emit("message", { message: message })
        }
        setMessage("");
    }

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    }

    let chatClass = ['header-chat'];
    if (props.chatOpen && props.listOpen) {
        chatClass = [...chatClass, 'open'];
    }

    const closeChat = () => {
        socket.emit("leave", { chatroomId: room._id })
        props.closed();
    }

    return (
        <Aux>
            <div className={chatClass.join(' ')}>
                <div className="h-list-header">
                    <h6>{room.name}</h6>
                    <a href={DEMO.BLANK_LINK} className="h-back-user-list" onClick={closeChat}><i className="feather icon-chevron-left" /></a>
                </div>
                <div className="h-list-body">
                    <div className="main-chat-cont">
                        <PerfectScrollbar
                            onScrollUp={(ref) => {
                                if (ref.scrollTop === 0) {
                                    handleLoadMoreMessages();
                                }
                            }}
                            ref={ref => {
                                setScrollRef(ref);
                            }}
                            containerRef={ref => {
                                setScrollCtrRef(ref);
                            }}>
                            <div className="main-friend-chat">
                                {isLoadMessages ?
                                    (<Row justify="center">
                                        <Spin tip="Loading..."></Spin>
                                    </Row>) :
                                    null
                                }
                                {messageDisplay}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                <div className="h-list-footer">
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
                </div>
            </div>
        </Aux>
    );
};

export default ChatRoom;