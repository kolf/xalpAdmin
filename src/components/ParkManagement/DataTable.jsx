import React from "react";
import { Table, Tabs } from "antd";
const { TabPane } = Tabs;

const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
  },
];

export default function DataTable() {
  return (
    <div className="pad">
      <Tabs defaultActiveKey="1">
        <TabPane tab="设备信息" key="1"></TabPane>
        <TabPane tab="Tab 2" key="2"></TabPane>
        <TabPane tab="Tab 3" key="3"></TabPane>
      </Tabs>
      <Table dataSource={dataSource} columns={columns} size="small" bordered />
    </div>
  );
}
