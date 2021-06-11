import React from "react";
import { Redirect } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Sidebar/Menu";
import "./PrivateLayout.less";
import sessionService from "../../services/session.service";

import { Layout } from "antd";
import AppFooter from "./AppFooter";
const { Content, Sider } = Layout;

export default class MainLayout extends React.Component {
  render() {
    if (!sessionService.isAuthenticated()) {
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: this.props.location } }}
        />
      );
    }
    return (
      <Layout style={{ height: "100%", _backgroundColor: "transparent" }}>
        <AppHeader />
        <Layout
          style={{ backgroundColor: "transparent", padding: "8px 8px 0" }}
        >
          <Sider
            width={400}
            style={{
              backgroundColor: "transparent",
              padding: "12px",
              zIndex: 10,
            }}
          >
            <Sidebar />
          </Sider>
          <Content style={{ padding: "12px 0" }}>{this.props.children}</Content>
          <Sider
            width={140}
            style={{
              backgroundColor: "transparent",
              padding: "12px",
              height: "32px",
            }}
          >
            <Menu />
          </Sider>
          <AppFooter />
        </Layout>
      </Layout>
    );
  }
}
