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
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const plainOptions = [{value:'1',label:'启用'},{value:'2',label:'再次验证未入园'},{value:'3',label:'可预售'}];

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
      res = await faciliyService.updateStaff({
        ...makeParams(values),
        id: defaultValues.id,
      });
      utils.success(`更新成功！`);
    } else {
      res = await faciliyService.addStaff(makeParams(values));
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === "date" && value) {
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

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={defaultValues}
      >
        <Form.Item label="门票名称" name="jobNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="客户类型" name="name">
          <Radio.Group defaultValue={1}>
            <Radio value={1}>个人</Radio>
            <Radio value={2}>团体</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="票面价格" name="name">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="可用次数" name="organizationUnit">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="包含人数" name="jobNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="票面价格" name="name">
          <Checkbox.Group options={plainOptions} />
        </Form.Item>
        <Form.Item label="可预售天数" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="有效天数" name="organizationUnit">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="详情描述" name="organizationUnit">
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
