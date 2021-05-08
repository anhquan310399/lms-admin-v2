import React from 'react';

import Aux from "../../../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../../../store/constant";

const messages = (props) => {

    const { user, message } = props;
    let image = '';
    if (user._id !== message.user._id) {
        image = (
            <a className="media-left photo-table" href={DEMO.BLANK_LINK}>
                <img className="media-object img-radius img-radius m-t-5" src={message.user.urlAvatar} alt={message.user.firstName + " " + message.user.lastName} />
            </a>
        );
    }

    let msgClass = ['media-body'];
    if (user._id !== message.user._id) {
        msgClass = [...msgClass, 'chat-menu-content'];
    } else {
        msgClass = [...msgClass, 'chat-menu-reply'];
    }

    return (
        <Aux>
            <div className="media chat-messages">
                {image}
                <div className={msgClass.join(' ')}>
                    <div className="">
                        <p className="chat-cont">{message.message}</p>
                    </div>
                    <p className="chat-time">{message.time}</p>
                </div>
            </div>
        </Aux>
    );
};

export default messages;