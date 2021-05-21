import React, { useState, useEffect } from "react";
import {
  Table,
  Tabs,
  Button,
  Select,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
} from "antd";
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
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
    title: "角色名称",
    dataIndex: "name",
  },
  {
    title: "最后编辑时间",
    dataIndex: "age",
  },
  {
    title: "权限详情",
    dataIndex: "address",
  },
  {
    title: "操作",
    dataIndex: "options",
    render() {
      return (
        <div className="text-center">
          <Button size="small" style={{ marginRight: 4 }}>
            编辑
          </Button>
          <Button size="small">删除</Button>
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
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <RangePicker size="small" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={dataSource} columns={columns} size="small" bordered />
    </div>
  );
}
