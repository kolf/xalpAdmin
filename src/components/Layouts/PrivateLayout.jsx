import React from "react";
import { Route, Redirect } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "../Sidebar/Sidebar";
import Menu from "../Sidebar/Menu";
import "./PrivateLayout.less";
import sessionService from "../../services/session.service";

import { Layout } from "antd";
import AppFooter from "./AppFooter";
import AliMap from "../UI/AliMap";
const { Content, Sider } = Layout;

export default class PrivateLayout extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          sessionService.isAuthenticated() ? (
            <Layout style={{ height: "100%", _backgroundColor: "transparent" }}>
              <AppHeader />
              <Layout
                style={{ backgroundColor: "transparent", padding: "8px 8px 0" }}
              >
                <Sider
                  width={10}
                  style={{
                    backgroundColor: "transparent",
                    padding: "12px",
                    zIndex: 10,
                  }}
                >
                  <Sidebar />
                </Sider>
                <Content style={{ padding: "12px 0" }}>
                  <Component {...props} />
                </Content>
                <Sider
                  width={140}
                  style={{
                    backgroundColor: "transparent",
                    padding: "12px",
                  }}
                >
                  <Menu />
                </Sider>
                <AppFooter />
              </Layout>
              <AliMap />
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
