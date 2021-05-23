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
  Space,
  message,
} from "antd";
import UploadImage from "../UI/UploadImage";
import { merchantOptions } from "../../shared/options";
import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;
const { Option } = Select;

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
      res = await faciliyService.updateStaff({
        ...values,
        id: defaultValues.id,
      });
      message.success(`更新成功！`);
    } else {
      res = await faciliyService.addStaff(values);
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
        <Form.Item label="开始/截至日期" name="date">
          <RangePicker />
        </Form.Item>
        <Form.Item label="时间段票数" name="jobNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="库存提示" name="jobName">
          <Space>
            <span>数量低于</span>
            <InputNumber />
            <span>提示“余票过少”</span>
          </Space>
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
