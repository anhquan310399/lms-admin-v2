import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";

import io from "socket.io-client";
import { getCookie } from '../../../services/localStorage';
import * as notify from "../../../services/notify";
import './app.scss';

class AdminLayout extends Component {

    state = {
        menu: null,
        socket: null
    }

    componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }
        const token = getCookie("token");
        if (token && !this.state.socket) {
            const newSocket = io("http://localhost:8000", {
                query: {
                    token: token,
                },
            });
            newSocket.on("connect", () => {
                notify.notifySuccess("success", "Socket Connected!");
            });
            newSocket.on("disconnect", () => {
                notify.notifyError("fail", "Socket Disconnected!");
            });
            this.setState({ socket: newSocket });
        }
        const menu = routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} socket={this.state.socket} />
                    )} />
            ) : (null);
        });
        this.setState({ menu: menu });
    }


    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }

    render() {

        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen}>
                    <Navigation />
                    <NavBar socket={this.state.socket} />
                    <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader />}>
                                                <Switch>
                                                    {this.state.menu}
                                                    <Redirect from="/" to={this.props.defaultPath} />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fullscreen>
            </Aux >
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        configBlock: state.configBlock,
        layout: state.layout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
        onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));