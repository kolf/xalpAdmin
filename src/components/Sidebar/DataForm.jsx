import React, { useState, useEffect } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import Spacer from "../UI/Spacer";
import {
  areaOptions,
  yearOptions,
  deviceOptions,
  mouthOptions,
  dayOptions,
} from "../../shared/options";
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
          <Form.Item name="a1" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择区域">
              {areaOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a2" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="选择设备">
              {deviceOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a3" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="选择时间类型">
              <Option value="1">年</Option>
              <Option value="2">月</Option>
              <Option value="3">日</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a4" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择年份">
              {yearOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a5" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择月份">
              {mouthOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a6" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择日">
              {dayOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a4" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择年份">
              {yearOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a5" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择月份">
              {mouthOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="a6" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="请选择日">
              {dayOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <Button size="small" block ghost>
            查询数据
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
