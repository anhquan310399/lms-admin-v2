import React from 'react';

import Aux from "../../../../../../../../hoc/_Aux";
import DEMO from "../../../../../../../../store/constant";

const Contact = (props) => {
    const { contact } = props;

    return (
        <Aux>
            <div className={props.activeId === contact._id ? 'media userlist-box ripple active' : 'media userlist-box ripple'} onClick={props.clicked}>
                <a className="media-left" href={DEMO.BLANK_LINK}> <img className="media-object img-radius" src={contact.urlAvatar} alt={contact.firstName + " " + contact.lastName} ></img> </a>
                <div className="media-body">
                    <h6 className="chat-header">{contact.firstName + " " + contact.lastName}</h6>
                </div>
            </div>
        </Aux>
    );
};

export default Contact;