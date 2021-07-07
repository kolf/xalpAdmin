import React, { useRef, useState, useEffect } from "react";
import { Select, Dropdown, Button, Menu } from "antd";
import { DownOutlined, MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useHover } from "ahooks";
import sessionService from "../../services/session.service";
import history from "../../shared/history";
const { Option } = Select;

export default function AppMenu() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const isHovering = useHover(ref);

  const roles = sessionService.getUserRoles();

  useEffect(() => {
    if (isHovering && !visible) {
      setVisible(true);
    }
  }, [isHovering]);

  const menu = (
    <Menu>
      {/SmartTicketing.Devices/.test(roles) && (
        <Menu.Item>
          <Link to="/police">入园设备</Link>
        </Menu.Item>
      )}
      {/SmartTicketingReservation.TimeRangeSettings/.test(roles) && (
        <Menu.Item>
          <Link to="/calendar">预约量管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketingReservation.(Personal|Personal)|Personal.(Merchants|Staffs)/.test(
        roles
      ) && (
        <Menu.Item>
          <Link to="/facility">预约入园</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.BlockUsers/.test(roles) && (
        <Menu.Item>
          <Link to="/blacklist">黑名单管理</Link>
        </Menu.Item>
      )}
      {/AbpIdentity/.test(roles) && (
        <Menu.Item>
          <Link to="/user">权限管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.Products/.test(roles) && (
        <Menu.Item>
          <Link to="/ticket-category">票种管理</Link>
        </Menu.Item>
      )}
      {/SmartTicketing.ParkActivities/.test(roles) && (
        <Menu.Item>
          <Link to="/activity">活动管理</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div ref={ref} style={{ textAlign: "right" }}>
      {isHovering || visible ? (
        <Dropdown
          overlay={menu}
          trigger={["hover"]}
          visible={visible}
          onVisibleChange={setVisible}
        >
          <Button
            style={{ width: "100%", backgroundColor: "rgba(11, 34, 63, 0.9)" }}
            icon={<MenuOutlined />}
          >
            系统菜单
          </Button>
        </Dropdown>
      ) : (
        <Button
          icon={<SettingOutlined />}
          style={{ backgroundColor: "rgba(11, 34, 63, 0.9)" }}
        />
      )}
    </div>
  );
}
