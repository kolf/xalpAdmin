import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Layout, Menu } from "antd";
import sessionService from "../../services/session.service";

import "./AppHeader.css";

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
      <Header style={{ padding: 0,background: 'rgba(6,26,53,.8)' }}>
        <div className="brand">雄安郊野公园</div>
        <Menu mode="horizontal" defaultSelectedKeys={["3"]}>
          <Menu.Item key="1">智慧灌溉系统</Menu.Item>
          <Menu.Item key="2">广播管理系统</Menu.Item>
          <Menu.Item key="3"><Link to='/park-management'>入园管理系统</Link></Menu.Item>
          <Menu.Item key="4">生态监测系统</Menu.Item>
          <Menu.Item key="5">管养运维系统</Menu.Item>
          <Menu.Item key="6">信息发布系统</Menu.Item>
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
