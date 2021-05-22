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
import { onlineOptions, deviceOptions } from "../../shared/options";
const { Option } = Select;

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
          <Select size="small" placeholder="设备类型" allowClear>
            {deviceOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
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
            {onlineOptions.map((o) => (
              <Radio key={o.value} value={o.value}>{o.label}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
}
