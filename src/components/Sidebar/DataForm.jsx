import React, { useState, useEffect } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import moment from "moment";
import Spacer from "../UI/Spacer";
import {
  areaOptions,
  yearOptions,
  deviceOptions,
  mouthOptions,
  dayOptions,
} from "../../shared/options";
import utils from "../../shared/utils";
const { Option } = Select;

export default function HorizontalLoginForm({ onChange }) {
  const [form] = Form.useForm();
  const [timeRangeType, setTimeRangeType] = useState("");

  useEffect(() => {
    console.log("55");
    onChange(makeInitialValues())
  }, []);

  const checkValues = async (values) => {
    let error = "";
    if (!values.CheckDeviceType) {
      error = "请选择设备类型！";
    } else if (!values.TimeRangeType) {
      error = "请选择时间类型！";
    } else if (!values["year-1"] && !values["year-2"]) {
      error = "请至少选择一种数据！";
    } else if (values["year-1"] && values["year-2"]) {
      if (timeRangeType === "2") {
        if (
          (values["month-1"] && !values["month-2"]) ||
          (values["month-2"] && !values["month-1"])
        ) {
          error = "请选择月份进行对比！";
        }
      }
    }

    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      const res = await checkValues(values);
      onChange(values);
    } catch (error) {
      utils.error(error);
    }
  };

  const makeInitialValues = () => {
    const m1 = moment();
    const m2 = moment().set({ month: m1.month() });

    return {
      CheckDeviceType: "2",
      TimeRangeType: "2",
      "year-1": m1.year(),
      "month-1": m1.month() + 1 + "",
      "year-2": m2.year(),
      "month-2": m2.month() + "",
    };
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={makeInitialValues()}>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name="CheckDeviceType" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="设备类型">
              {deviceOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="TimeRangeType" style={{ marginBottom: 6 }}>
            <Select
              size="small"
              placeholder="时间类型"
              onChange={(value) => {
                setTimeRangeType(value);
                let nextFieldsValue = {};
                if (value === "2") {
                  nextFieldsValue["date-1"] = undefined;
                  nextFieldsValue["date-2"] = undefined;
                }
                if (value === "4") {
                  nextFieldsValue["month-1"] = undefined;
                  nextFieldsValue["month-2"] = undefined;
                  nextFieldsValue["date-1"] = undefined;
                  nextFieldsValue["date-2"] = undefined;
                }
                form.setFieldsValue(nextFieldsValue);
              }}
            >
              <Option value="4">年</Option>
              <Option value="2">月</Option>
              <Option value="1">日</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={7}>
          <Form.Item name="year-1" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="年份">
              {yearOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="month-1" style={{ marginBottom: 6 }}>
            <Select
              size="small"
              placeholder="月份"
              disabled={/(4)/.test(timeRangeType)}
            >
              {mouthOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="date-1" style={{ marginBottom: 6 }}>
            <Select
              size="small"
              placeholder="日期"
              disabled={/(2|4)/.test(timeRangeType)}
            >
              {dayOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <div className="dataform-done">
            <div
              className="dataform-done-icon"
              style={{ backgroundColor: "#32E9FF" }}
            ></div>
            <div className="dataform-done-text">数据颜色</div>
          </div>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={7}>
          <Form.Item name="year-2" style={{ marginBottom: 6 }}>
            <Select size="small" placeholder="年份">
              {yearOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="month-2" style={{ marginBottom: 6 }}>
            <Select
              size="small"
              placeholder="月份"
              disabled={/(4)/.test(timeRangeType)}
            >
              {mouthOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="date-2" style={{ marginBottom: 6 }}>
            <Select
              size="small"
              placeholder="日期"
              disabled={/(2|4)/.test(timeRangeType)}
            >
              {dayOptions.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <div className="dataform-done">
            <div
              className="dataform-done-icon"
              style={{ backgroundColor: "#1FFE9A" }}
            ></div>
            <div className="dataform-done-text">数据颜色</div>
          </div>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <Button size="small" block ghost htmlType="submit">
            查询数据
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
