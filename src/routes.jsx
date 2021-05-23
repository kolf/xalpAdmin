import React from "react";
import { BrowserRouter, Router, Switch } from "react-router-dom";

import PublicLayout from "./components/Layouts/PublicLayout";
import PrivateLayout from "./components/Layouts/PrivateLayout";

import Login from "./components/Login/Login";
import Unauthorized from "./components/Pages/Unauthorized";
import NotFound from "./components/Pages/NotFound";
import LoginExpired from "./components/Pages/LoginExpired";
import history from "./shared/history";

import Home from "./components/Home";
import User from "./components/User";
import Blacklist from "./components/Blacklist";
import Police from "./components/Police";
import Facility from "./components/Facility";
import Data from "./components/Data";

export default class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Router history={history}>
          <Switch>
            <PrivateLayout path="/" exact component={Home} />
            <PrivateLayout path="/user" exact component={User} />
            <PrivateLayout path="/data" exact component={Data} />
            <PrivateLayout path="/blacklist" exact component={Blacklist} />
            <PrivateLayout path="/police" exact component={Police} />
            <PrivateLayout path="/facility" exact component={Facility} />
            <PublicLayout path="/login" component={Login} />
            <PublicLayout path="/unauthorized" component={Unauthorized} />
            <PublicLayout path="/login-expired" componet={LoginExpired} />
            <PublicLayout path="*" component={NotFound} />
          </Switch>
        </Router>
      </BrowserRouter>
    );
  }
}
