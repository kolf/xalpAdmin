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
import UploadImage from "../UI/UploadImage";
import utils from "../../shared/utils";
import { merchantOptions } from "../../shared/options";
import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

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
          const [start, end] = value;
          result.startPermissionDate = start.format(dateFormat);
          result.endPermissionDate = end.format(dateFormat);
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
        <Form.Item label="工号" name="jobNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="岗位" name="organizationUnit">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="身份证号" name="certNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="照片" name="tempFaceFileName">
          <UploadImage />
        </Form.Item>
        <Form.Item label="有效入园时间段" name="date">
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
