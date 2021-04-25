import React, { Component } from 'react';
import axios from 'axios';
import { getCookie } from '../../../../../../../services/localStorage';

import Room from './Room';
import Chat from './Chat';
import Aux from "../../../../../../../hoc/_Aux";

class Rooms extends Component {
    state = {
        chatOpen: false,
        room: [],
        rooms: [],
    };

    getChatRooms = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/chatroom/`, {
            headers: {
                'Authorization': getCookie("token")
            }
        })
            .then(res => {
                this.setState({ rooms: res.data.rooms })
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentWillMount = () => {
        this.getChatRooms();


    }

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.listOpen) {
            this.setState({ chatOpen: false, room: {} });
        }
    };

    render() {
        const roomList = (this.state.rooms).map(r => {
            return <Room key={r._id} room={r} activeId={this.state.room._id} clicked={() => this.setState({ chatOpen: true, room: r })} />;
        });
        return (
            <Aux>
                {roomList}
                <Chat socket={this.props.socket} room={this.state.room} chatOpen={this.state.chatOpen} listOpen={this.props.listOpen} closed={() => this.setState({ chatOpen: false, room: {} })} />
            </Aux>
        );
    }
}

export default Rooms;
