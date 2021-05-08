import React from 'react';

import Aux from "../../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../../store/constant";

const Room = (props) => {
    const { room } = props;

    return (
        <Aux>
            <div className={props.activeId === room._id ? 'media userlist-box ripple active' : 'media userlist-box ripple'} onClick={props.clicked}>
                <a className="media-left" href={DEMO.BLANK_LINK}> <img className="media-object img-radius" src={room.image} alt={room.name} /></a>
                <div className="media-body">
                    <h6 className="chat-header">{room.name}</h6>
                </div>
            </div>
        </Aux>
    );
};

export default Room;