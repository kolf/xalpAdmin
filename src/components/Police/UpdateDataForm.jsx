import React, { useState } from "react";
import { Form, Input, Radio, Select, Button } from "antd";
import {
  deviceActiveOptions,
  deviceOptions,
  enterOptions,
} from "../../shared/options";
import utils from "../../shared/utils";
import policeService from "../../services/police.service";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      res = await policeService.updateDevice({
        ...makeParams(values),
        id: defaultValues.id,
      });
      utils.success(`更新成功！`);
    } else {
      res = await policeService.addDevice(makeParams(values));
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === "isActive" && value) {
          result.isActive = value === "1";
        } else if (key === "isDirectionEnter" && value) {
          result.isDirectionEnter = value === "1";
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        deviceType: 1,
      }
    );
  }

  function makeDefaultValues() {
    return Object.keys(defaultValues).reduce((result, key) => {
      const value = defaultValues[key];
      if (key === "isActive" && value) {
        result.isActive = value ? "1" : "0";
      } else if (key === "isDirectionEnter" && value) {
        result.isActive = value ? "1" : "0";
      } else if (/^(checkDeviceType)$/.test(key)) {
        result[key] = value + "";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item label="设备名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="设备编号" name="code">
          <Input />
        </Form.Item>
        <Form.Item label="设备IP地址" name="ipAddress">
          <Input />
        </Form.Item>
        <Form.Item label="设备类型" name="checkDeviceType">
          <Select size="small" placeholder="设备类型" allowClear>
            {deviceOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="录入人员姓名" name="creatorName">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="录入人工号" name="creatorJobNumber">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="录入人员电话" name="creatorPhone">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="管理人姓名" name="handlerName">
          <Input />
        </Form.Item>
        <Form.Item label="管理员电话" name="handlerPhone">
          <Input />
        </Form.Item>
        <Form.Item label="设备状态" name="isActive">
          <Radio.Group>
            {deviceActiveOptions.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="出入口状态" name="isDirectionEnter">
          <Radio.Group>
            {enterOptions.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
