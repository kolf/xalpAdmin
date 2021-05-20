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
      <Header
        style={{
          padding: 0,
          display: "flex",
          backgroundColor: "rgba(6, 26, 53, 0.8)",
          height: "66px",
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
          {/* <Menu.Item key="1">
            <Link to="/" className="header-nav">
              智慧灌溉系统
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/" className="header-nav">
              广播管理系统
            </Link>
          </Menu.Item> */}
          <Menu.Item key="3">入园管理系统</Menu.Item>
          {/* <Menu.Item key="4">
            <Link to="/" className="header-nav">
              生态监测系统
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/" className="header-nav">
              管养运维系统
            </Link>
          </Menu.Item>*/}
        </Menu>
        <div style={{ paddingRight: "12px", display: "flex" }}>
          <div>02:03:40</div>
          {/* <div>
            <div>星期五</div>
            <div>2012年10月21日</div>
          </div> */}
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
