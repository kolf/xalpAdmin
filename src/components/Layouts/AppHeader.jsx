import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import sessionService from "../../services/session.service";

import "./AppHeader.less";

import * as sessionActions from "../../store/actions/session.actions";

const { Header } = Layout;

class AppHeader extends React.Component {
  userData = sessionService.getUser();

  onLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    return (
      <Header style={{ padding: 0, background: "none" }}>
        <div className="brand">雄安郊野公园</div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["3"]}
          style={{ backgroundColor: "rgba(6, 26, 53, 0.8)" }}
        >
          <Menu.Item key="1">
            <Link to="/" className="header-nav">
              智慧灌溉系统
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/" className="header-nav">
              广播管理系统
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/park-management" className="header-nav">
              入园管理系统
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/" className="header-nav">
              生态监测系统
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/" className="header-nav">
              管养运维系统
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/" className="header-nav">
              信息发布系统
            </Link>
          </Menu.Item>
        </Menu>
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
