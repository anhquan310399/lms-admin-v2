import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import RedirectRoute from "../app.route";
import Login from "./pages/Login/index";

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

class App extends Component {
    render() {
        return (
            <Aux>
                <ScrollToTop>
                    <Suspense fallback={<Loader />}>
                        <Switch>
                            <Route path="/login" exact render={(props) => <Login {...props} />} />
                            <RedirectRoute path="/" component={AdminLayout} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;
