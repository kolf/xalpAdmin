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
    address: "压顶地",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "压顶地",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "压顶地",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "压顶地",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "压顶地",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "压顶地",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "压顶地",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "压顶地",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "压顶地",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "压顶地",
  },
];

const columns = [
  {
    title: "订单号",
    dataIndex: "name",
  },
  {
    title: "预约人",
    dataIndex: "age",
  },
  {
    title: "电话",
    dataIndex: "address",
  },
  {
    title: "是否代预约",
    dataIndex: "user",
  },
  {
    title: "参观人",
    dataIndex: "num",
  },
  {
    title: "电话",
    dataIndex: "phone",
  },
  {
    title: "身份证",
    dataIndex: "online",
  },  {
    title: "预约时段",
    dataIndex: "online",
  },  {
    title: "参与活动",
    dataIndex: "online",
  },
  {
    title: "抵达方式（客源地）",
    dataIndex: "online",
  },{
    title: "随行宠物",
    dataIndex: "online",
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
