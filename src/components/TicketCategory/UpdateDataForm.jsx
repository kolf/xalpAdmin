import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import utils from "../../shared/utils";
import ticketCategoryService from "../../services/ticket-category.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const plainOptions = [
  { value: "1", label: "启用" },
  { value: "2", label: "再次验证未入园" },
  { value: "3", label: "可预售" },
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
    } catch (error) {}
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await ticketCategoryService.updateProduct({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {
        utils.error((error.error || {}).message || "请求失败！");
      }
    } else {
      try {
        res = await ticketCategoryService.addProduct(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {
        utils.error((error.error || {}).message || "请求失败！");
      }
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === "options") {
          if (!value) {
            result.isActive = false;
            result.isCanBeRechecked = false;
            result.isCanPresale = false;
          } else {
            result.isActive = value.includes("1");
            result.isCanBeRechecked = value.includes("2");
            result.isCanPresale = value.includes("3");
          }
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        staffType: 1,
      }
    );
  }

  function makeDefaultValues() {
    const { id, name } = defaultValues;

    if (!id) {
      return {};
    }
    return {
      name,
    };
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues()}
      >
        <Form.Item label="门票名称" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="客户类型" name="clientType">
          <Radio.Group defaultValue={1}>
            <Radio value={1}>个人</Radio>
            <Radio value={2}>团体</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="票面价格" name="priceSale">
          <InputNumber min={0} placeholder="请输入" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="可用次数" name="enterTimes">
          <InputNumber min={0} placeholder="请输入" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="包含人数" name="unitUserCount">
          <InputNumber min={0} placeholder="请输入" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="选项" name="options">
          <Checkbox.Group options={plainOptions} />
        </Form.Item>
        <Form.Item label="可预售天数" name="presaleDays">
          <InputNumber min={0} placeholder="请输入" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="有效天数" name="validDays">
          <InputNumber min={0} placeholder="请输入" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="详情描述" name="note">
          <Input.TextArea placeholder="请输入" />
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
