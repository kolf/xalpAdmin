import React, { useState, useEffect } from "react";
import moment from "moment";
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
import blanklistService from "../../services/blanklist.service";
const { RangePicker } = DatePicker;
const { Option } = Select;
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
  const [blockBehaviorOptions, setBlockBehaviorOptions] = useState([]);
  useEffect(() => {
    let mounted = true;

    loadData();

    async function loadData() {
      try {
        const res = await blanklistService.getBlockAllowUserOptions();
        const options = res.items.map((item) => ({
          value: item.id,
          label: item.displayText,
        }));
        if (mounted) {
          setBlockBehaviorOptions(options);
        }
      } catch (error) {}
    }
    return () => {
      mounted = false;
    };
  }, []);

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await blanklistService.updateBlockAllowUser({
          ...makeParams(values),
          id: defaultValues.id,
        });
        onOk && onOk(res);
        utils.success(`更新成功！`);
      } catch (error) {
        onOk && onOk(error);
      }
    } else {
      try {
        res = await blanklistService.addBlockAllowUser(makeParams(values));
        onOk && onOk(res);
        utils.success(`添加成功！`);
      } catch (error) {
        onOk && onOk(error);
      }
    }
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === "startTime" && value) {
          result.startTime = value.format(dateFormat);
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        userType: 1,
        certType: "证件号码",
      }
    );
  }

  function makeDefaultValues() {
    const {
      id,
      name,
      certNumber,
      phone,
      behaviorId,
      startTime,
      address,
      reason,
    } = defaultValues;

    if (!id) {
      return {};
    }
    return {
      name,
      certNumber,
      phone,
      behaviorId,
      address,
      reason,
      startTime: moment(startTime, dateFormat),
    };
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
          label="姓名"
          name="name"
          rules={[{ required: true, message: "请输入姓名!" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          label="证件号码"
          name="certNumber"
          rules={[{ required: true, message: "请输入证件号码!" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: "请输入手机号!" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="当前不文明行为"
          name="behaviorId"
          rules={[{ required: true, message: "请选择当前不文明行为!" }]}
        >
          <Select placeholder="请选择">
            {blockBehaviorOptions.map((o) => (
              <Option value={o.value} key={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="发生时间"
          name="startTime"
          rules={[{ required: true, message: "请输入!" }]}
        >
          <DatePicker size="small" />
        </Form.Item>
        <Form.Item
          label="发生地点"
          name="address"
          rules={[{ required: true, message: "请输入!" }]}
        >
          <Input size="small" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="详情描述"
          name="reason"
          rules={[{ required: true, message: "请输入!" }]}
        >
          <Input size="small" placeholder="请输入" />
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
