import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from "antd";

export default function UpdateDataForm() {
  return (
    <>
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        size="small"
      >
        <Form.Item label="设备名称">
          <Input />
        </Form.Item>
        <Form.Item label="设备IP地址">
          <Input />
        </Form.Item>
        <Form.Item label="设备类型">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="录入人员姓名">
          <Input />
        </Form.Item>
        <Form.Item label="录入人工号">
          <Input />
        </Form.Item>
        <Form.Item label="录入人员电话">
          <Input />
        </Form.Item>
        <Form.Item label="管理人姓名">
          <Input />
        </Form.Item>
        <Form.Item label="管理员电话">
          <Input />
        </Form.Item>
        <Form.Item label="设备状态" name="size">
          <Radio.Group>
            <Radio value="small">在线</Radio>
            <Radio value="default">离线</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
}
