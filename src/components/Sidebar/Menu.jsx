import React from "react";
import { Select, Dropdown, Button, Menu } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import sessionService from "../../services/session.service";
import history from "../../shared/history";
const { Option } = Select;

export default function AppMenu() {
  const roles = sessionService.getUserRoles();
  console.log(roles, "roles");

  const menu = (
    <Menu>
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/police">入园设备</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/calendar">预约量管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/facility">预约入园</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/blacklist">黑名单管理</Link>
        </Menu.Item>
      )}
      {/AbpIdentity/.test(roles) && (
        <Menu.Item>
          <Link to="/user">权限管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/ticket-category">票种管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/activity">活动管理</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button
        style={{ width: "100%", backgroundColor: "rgba(11, 34, 63, 0.9)" }}
        icon={<MenuOutlined />}
      ></Button>
    </Dropdown>
  );
}
