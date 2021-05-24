import React from "react";
import { Select } from "antd";
import history from "../../shared/history";
const { Option } = Select;

export default function Menu() {
  const handleSelect = (value) => {
    history.push(value);
  };
  return (
    <Select
      placeholder="系统菜单"
      style={{ width: "100%", backgroundColor: "rgba(11, 34, 63, 0.9)" }}
      onSelect={handleSelect}
    >
      <Option value="police">设备管理</Option>
      <Option value="facility">预约入园</Option>
      <Option value="blacklist">黑名单管理</Option>
      <Option value="user">权限管理</Option>
    </Select>
  );
}
