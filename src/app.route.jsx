import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "./services/localStorage.js";

const RedirectRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);
export default RedirectRoute;
