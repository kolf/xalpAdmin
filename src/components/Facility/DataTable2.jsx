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
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">
          今日预约人数<span style={{ marginRight: 12 }}>1223</span>今日核销人数
          <span>1223</span>
        </Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Button size="small" type="primary">
            下载数据
          </Button>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Select placeholder="系统菜单" size="small">
            <Option value="police">设备管理</Option>
            <Option value="facility">预约入园</Option>
            <Option value="blacklist">黑名单管理</Option>
            <Option value="user">权限管理</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <RangePicker size="small" />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              size="small"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              查询数据
            </Button>
          )}
        </Form.Item>
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search size="small" placeholder="模糊搜索" />
        </Form.Item>
      </Form>

      <Table dataSource={dataSource} columns={columns} size="small" bordered />
    </div>
  );
}
