import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { getCookie } from '../../../../../../../services/localStorage';

import Aux from "../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../store/constant";

import 'antd/dist/antd.css';
import { Input } from 'antd';
import { Spin, Row, Button } from 'antd';
import Contact from './Contact/Contact';
import NewContact from './NewContact/NewContact';

const { Search } = Input;

const Contacts = (props) => {

    const [listContacts, setListContacts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [scrollCtrRef, setScrollCtrRef] = useState();
    // eslint-disable-next-line no-unused-vars
    const [scrollRef, setScrollRef] = useState();

    const [newOpen, setNewOpen] = useState(false);

    const scrollToCurrent = (height) => {
        if (scrollCtrRef) {
            scrollCtrRef.scrollTop = height;
        }
    }

    const [searchText, setSearchText] = useState("");

    const handleLoadContact = (value, amount = 0) => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/chatroom/contact`,
            {
                searchText: value,
                current: amount
            },
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            })
            .then(res => {
                if (amount === 0) {
                    setListContacts([...res.data.contacts]);
                } else {
                    const preHeight = scrollCtrRef.scrollHeight;
                    setListContacts([...listContacts, ...res.data.contacts]);
                    const currentHeight = scrollCtrRef.scrollHeight
                    scrollToCurrent(currentHeight - preHeight);
                }

            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    let contactClass = ['header-chat'];
    if (props.contactOpen && props.listOpen) {
        contactClass = [...contactClass, 'open'];
    }

    const [newContact, setNewContact] = useState()

    const closeContact = () => {
        props.closed();
    }

    useEffect(() => {
        if (!props.listOpen) {
            props.closed();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.listOpen])

    const removeContact = (id, room) => {
        setListContacts(listContacts.filter(contact => contact._id !== id));
        props.addRoom(room);
    }

    return (
        <Aux>
            <div className={contactClass.join(' ')}>
                <div className="h-list-header">
                    <div style={{ marginLeft: '20px' }} >
                        <Search placeholder="Search ..." loading={isLoading} allowClear enterButton onSearch={(value) => {
                            if (value.trim()) {
                                handleLoadContact(value.trim());
                                setSearchText(value.trim());
                            }
                        }} />
                    </div>
                    <a href={DEMO.BLANK_LINK} className="h-back-user-list" onClick={closeContact}><i className="feather icon-chevron-left" /></a>
                </div>
                <div className="h-list-body" style={{ backgroundColor: 'white' }}>
                    <div className="main-friend-cont scroll-div">
                        <div className="main-friend-list">
                            <PerfectScrollbar
                                ref={ref => {
                                    setScrollRef(ref);
                                }}
                                containerRef={ref => {
                                    setScrollCtrRef(ref);
                                }}>
                                {listContacts.map((contact, index) => {
                                    return <Contact key={index} contact={contact} clicked={() => {
                                        setNewOpen(true);
                                        setNewContact(contact);
                                    }} />
                                })}
                                {isLoading ?
                                    <Row justify="center">
                                        <Spin tip="Loading..."></Spin>
                                    </Row>
                                    : (
                                        listContacts.length > 0 &&
                                        <Row justify="center">
                                            <Button onClick={() => {
                                                handleLoadContact(searchText, listContacts.length)
                                            }} >Load more</Button>
                                        </Row>
                                    )
                                }
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>

            <NewContact socket={props.socket} contact={newContact} newOpen={newOpen} contactOpen={props.contactOpen} closed={() => {
                setNewOpen(false);
                setNewContact({});
            }}
                removeContact={removeContact} />
        </Aux >
    );
};

export default Contacts;