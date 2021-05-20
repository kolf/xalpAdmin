import React, { useState, useEffect } from "react";
import { Table, Tabs, Button, Select, Radio, Form, Calendar } from "antd";
const { TabPane } = Tabs;
const { Option } = Select;

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
    title: "设备IP",
    dataIndex: "name",
  },
  {
    title: "设备名称",
    dataIndex: "age",
  },
  {
    title: "设备类型",
    dataIndex: "address",
  },
  {
    title: "录入人姓名",
    dataIndex: "user",
  },
  {
    title: "录入人工号",
    dataIndex: "num",
  },
  {
    title: "录入人员电话",
    dataIndex: "phone",
  },
  {
    title: "在线状态",
    dataIndex: "online",
  },
  {
    title: "操作",
    dataIndex: "options",
    render() {
      return (
        <div className="text-center">
          <Button size="small" style={{ marginRight: 4 }}>
            查看操作日志
          </Button>
          <Button size="small">编辑</Button>
        </div>
      );
    },
  },
];

export default function DataTable() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    console.log("Finish:", values);
  };

  return (
    <div>
      <Radio.Group defaultValue={"1"} size="small">
        <Radio.Button value="1">日历</Radio.Button>
        <Radio.Button value="2">列表</Radio.Button>
      </Radio.Group>
      <Calendar style={{backgroundColor:'transparent'}}/>
    </div>
  );
}
