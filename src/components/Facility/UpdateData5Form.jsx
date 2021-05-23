import React, { useState, useEffect } from "react";
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
  message,
} from "antd";
import { merchantOptions } from "../../shared/options";
import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const [merchantOptions, setMerchantOptions] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { items } = await commonService.getOptions({ id: 40 });
      setMerchantOptions(items);
    } catch (error) {}
  }

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { value: item.id + "", label: item.displayText };
    });
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      res = await faciliyService.updateMerchant({
        ...values,
        id: defaultValues.id,
      });
      message.success(`更新成功！`);
    } else {
      res = await faciliyService.addMerchant(values);
      message.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  console.log(defaultValues, "defaultValues");

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={defaultValues}
      >
        <Form.Item label="供应商名称" name="name">
          <Input placeholder="请输入供应商名称" />
        </Form.Item>
        <Form.Item label="申请人姓名" name="handlerName">
          <Input placeholder="请输入申请人姓名" />
        </Form.Item>
        <Form.Item label="申请人电话" name="handlerPhone">
          <Input placeholder="请输入申请人电话" />
        </Form.Item>
        <Form.Item label="供应商类型" name="merchantTypeId">
          <Select placeholder="请选择">
            {makeData(merchantOptions).map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="有效入园时间段">
          <RangePicker />
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
