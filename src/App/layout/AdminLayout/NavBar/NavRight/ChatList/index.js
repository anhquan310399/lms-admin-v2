import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Rooms from './Rooms';
import Aux from "../../../../../../hoc/_Aux";
import DEMO from "../../../../../../store/constant";


const chatList = (props) => {
    let listClass = ['header-user-list'];
    if (props.listOpen) {
        listClass = [...listClass, 'open'];
    }

    return (
        <Aux>
            <div className={listClass.join(' ')}>
                <div className="h-list-header">
                    <div className="input-group">
                        <input type="text" id="search-friends" className="form-control" placeholder="Search User . . ." />
                    </div>
                </div>
                <div className="h-list-body">
                    <a href={DEMO.BLANK_LINK} className="h-close-text" onClick={props.closed}><i className="feather icon-chevrons-right" /></a>
                    <div className="main-friend-cont scroll-div">
                        <div className="main-friend-list" style={{ height: 'calc(100vh - 85px)' }}>
                            <PerfectScrollbar>
                                <Rooms listOpen={props.listOpen} socket={props.socket} />
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default chatList;