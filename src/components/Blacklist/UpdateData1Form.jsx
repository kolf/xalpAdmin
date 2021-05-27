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
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await blanklistService.getBlockAllowUserOptions();
      const options = res.items.map((item) => ({
        value: item.id,
        label: item.displayText,
      }));
      setBlockBehaviorOptions(options);
    } catch (error) {}
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await blanklistService.updateBlockAllowUser({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {
        utils.error((error.error || {}).message || "请求失败！");
      }
    } else {
      try {
        res = await blanklistService.addBlockAllowUser(makeParams(values));
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
        if (key === "date" && value) {
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        userType: 1,
        certType: "身份证",
      }
    );
  }

  function makeDefaultValues() {
    const { id, name, certNumber, phone, behaviorId, startTime } =
      defaultValues;

    if (!id) {
      return {};
    }
    return {
      name,
      certNumber,
      phone,
      behaviorId,
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
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="身份证" name="certNumber">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="手机号" name="phone">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="当前不文明行为" name="behaviorId">
          <Select placeholder="请选择">
            {blockBehaviorOptions.map((o) => (
              <Option value={o.value} key={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="发生时间" name="startTime">
          <DatePicker size="small" />
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
