import React, { useState, useEffect } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import Spacer from "../UI/Spacer";
const { Option } = Select;

export default function HorizontalLoginForm() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    console.log("Finish:", values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="请选择区域">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="选择设备">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="选择时间类型">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="请选择年份">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="请选择月份">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Select size="small" placeholder="请选择日">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}><Button size="small" block ghost>查询数据</Button></Col>
        <Col span={12}><Button size="small" block ghost>导出数据</Button></Col>
      </Row>
    </Form>
  );
}
