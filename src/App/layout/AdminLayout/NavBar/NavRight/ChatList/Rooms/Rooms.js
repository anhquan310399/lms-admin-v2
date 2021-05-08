import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../../../../../../../services/localStorage';

import Room from './Room/Room';
import Chat from './Chat/Chat';
import Aux from "../../../../../../../hoc/_Aux";

const Rooms = ({ socket, listOpen, rooms }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [room, setRoom] = useState({});

    useEffect(() => {
        if (!listOpen) {
            setChatOpen(false);
            setRoom({});
        }
    }, [listOpen])

    return (
        <Aux>
            {rooms?.map(r => {
                return <Room key={r._id} room={r} activeId={room._id} clicked={() => {
                    setChatOpen(true);
                    setRoom(r);
                }}
                />;
            })}
            <Chat socket={socket} room={room} chatOpen={chatOpen} listOpen={listOpen} closed={() => {
                setChatOpen(false);
                setRoom({});
            }} />
        </Aux>
    );

}

export default Rooms;
