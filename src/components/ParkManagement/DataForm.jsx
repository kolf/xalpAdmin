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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
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
            style={{ marginBottom: 12 }}
          >
            <Select defaultValue="rmb">
              <Option value="rmb">RMB</Option>
              <Option value="dollar">Dollar</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
