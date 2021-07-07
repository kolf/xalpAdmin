import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Dropdown } from "antd";
import sessionService from "../../services/session.service";

import "./AppHeader.less";

import * as sessionActions from "../../store/actions/session.actions";
import DateWidget from "../UI/DateWidget";
import confirm from "../../shared/confirm";
import logoUrl from "../../assets/img/topbar.png";
import menuUrl from "../../assets/img/icon.png";

const { Header } = Layout;

class AppHeader extends React.Component {
  userData = sessionService.getUser();

  onLogout = (event) => {
    const mod = confirm({
      content: <div>此操作将退出登录, 是否继续?</div>,
      onOk: () => {
        mod.close();
        event.preventDefault();
        this.props.logout();
      },
    });
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
        <div className="brand"></div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["3"]}
          style={{
            background: "none",
            textAlign: "center",
            borderBottom: "none",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Menu.Item key="3">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={menuUrl} />
              <Link
                to="/"
                style={{ color: "#fff", fontSize: 28, marginLeft: 15 }}
              >
                入园管理
              </Link>
            </div>
          </Menu.Item>
        </Menu>
        <div style={{ padding: "0 12px" }}>
          <Dropdown
            placement="bottomCenter"
            arrow
            overlay={
              <Menu>
                <Menu.Item>
                  <a target="_blank" onClick={this.onLogout}>
                    退出系统
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {this.userData.username}
            </a>
          </Dropdown>
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
