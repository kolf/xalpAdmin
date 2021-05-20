import React from "react";
import { Route, Redirect } from "react-router-dom";

import AppHeader from "./AppHeader";

import "./PrivateLayout.css";
import imgUrl from '../../assets/img/cad-01.bb6c9874.png'
import SessionService from "../../services/session.service";

import { Layout } from "antd";
const { Content } = Layout;

export default class PrivateLayout extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          SessionService.isAuthenticated() ? (
            <Layout style={{height:'100%', background:`url(${imgUrl}) center`}}>
              <AppHeader />
              <Content>
                <Component {...props} />
              </Content>
            </Layout>
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }
      />
    );
  }
}
