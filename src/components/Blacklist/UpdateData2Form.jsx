import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import utils from "../../shared/utils";
import { behaviorTypeOptions } from "../../shared/options";
import blanklistService from "../../services/blanklist.service";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await blanklistService.updateBlockBehavior({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await blanklistService.addBlockBehavior(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        result[key] = value;
        return result;
      },
      {
        userType: 1,
        certType: "证件号码",
      }
    );
  }

  function makeDefaultValues() {
    const { name, note, behaviorType, id } = defaultValues;
    if (!id) {
      return {};
    }
    return { name, note, behaviorType: behaviorType + "" };
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item
          label="不文明行为名称"
          name="name"
          rules={[{ required: true, message: "请输入不文明行为名称!" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          label="程度(惩罚措施)"
          name="behaviorType"
          rules={[{ required: true, message: "请选择程度(惩罚措施)!" }]}
        >
          <Select placeholder="请选择">
            {behaviorTypeOptions.map((o) => (
              <Option value={o.value} key={o.value}>
                {o.label}
              </Option>
            ))}
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
