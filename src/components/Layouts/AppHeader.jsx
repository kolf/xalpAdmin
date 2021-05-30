import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import sessionService from "../../services/session.service";

import "./AppHeader.less";

import * as sessionActions from "../../store/actions/session.actions";
import DateWidget from "../UI/DateWidget";

const { Header } = Layout;

class AppHeader extends React.Component {
  userData = sessionService.getUser();

  onLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    return (
      <Header
        style={{
          paddingLeft: 0,
          paddingRight: 12,
          display: "flex",
          backgroundColor: "rgba(6, 26, 53, 0.8)",
          height: "66px",
          zIndex: 10,
        }}
      >
        <div className="brand">雄安郊野公园</div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["3"]}
          style={{
            background: "none",
            textAlign: "center",
            borderBottom: "none",
            flex: 1,
          }}
        >
          <Menu.Item key="3">
            <Link to="/">入园管理系统</Link>
          </Menu.Item>
        </Menu>
        <div style={{ padding: "0 12px" }}>
          <a href="/login">退出</a>
        </div>
        <div style={{ display: "flex" }}>
          <DateWidget />
        </div>
      </Header>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(sessionActions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(AppHeader);
