import React, { useState } from "react";
import { Form, Input, Button, Radio, Select } from "antd";
import utils from "../../shared/utils";
import userService from "../../services/user.service";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      res = await userService.updateUser({
        ...makeParams(values),
        id: defaultValues.id,
      });
      utils.success(`更新成功！`);
    } else {
      res = await userService.addUser(makeParams(values));
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function makeDefaultValues() {
    return Object.keys(defaultValues).reduce((result, key) => {
      const value = defaultValues[key];
      if (value !== undefined && value !== "-1") {
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
        <Form.Item label="选择角色">
          <Select placeholder='请选择'>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
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
