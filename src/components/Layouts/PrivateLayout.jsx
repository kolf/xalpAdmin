import React from "react";
import { Route, Redirect } from "react-router-dom";

import AppHeader from "./AppHeader";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Sidebar/Menu";
import "./PrivateLayout.css";
import imgUrl from "../../assets/img/cad-01.bb6c9874.png";
import SessionService from "../../services/session.service";

import { Layout } from "antd";
import AppFooter from "./AppFooter";
const { Content, Sider } = Layout;

export default class PrivateLayout extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          SessionService.isAuthenticated() ? (
            <Layout
              style={{ height: "100%", background: `url(${imgUrl}) center` }}
            >
              <AppHeader />
              <Layout
                style={{ backgroundColor: "transparent", padding: "8px 8px 0" }}
              >
                <Sider
                  width={400}
                  style={{ backgroundColor: "transparent", padding: "12px" }}
                >
                  <Sidebar />
                </Sider>
                <Content style={{ padding: "12px 0" }}>
                  <Component {...props} />
                </Content>
                <Sider
                  width={140}
                  style={{ backgroundColor: "transparent", padding: "12px" }}
                >
                  <Menu />
                </Sider>
                <AppFooter></AppFooter>
              </Layout>
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
