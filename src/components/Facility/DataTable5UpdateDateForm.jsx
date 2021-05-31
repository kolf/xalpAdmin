import React, { useState, useEffect } from "react";
import moment from "moment";
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
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import utils from "../../shared/utils";
import UploadImage from "../UI/UploadImage";
import { datePickerOptions } from "../../shared/options";
import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
import FormList from "./FormList";
const dateFormat = "YYYY-MM-DD";
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
  const [form] = Form.useForm();
  const [datePickerOptions, setDatePickerOptions] = useState([]);
  useEffect(() => {
    loadData();
  }, [JSON.stringify(datePickerOptions)]);

  async function loadData() {
    try {
      const { items } = await faciliyService.getReservationTimeItemOptions();
      const options = items.map((item) => ({
        label: item.displayText,
        value: item.id,
      }));

      setDatePickerOptions(options);
    } catch (error) {}
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await faciliyService.updateReservationTimeSetting({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await faciliyService.addReservationTimeSetting(
          makeParams(values)
        );
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  async function checkDateList1() {
    const { _items1 } = await form.getFieldsValue();
    if (Object.values(_items1).every((item) => item)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请完善时间段票数信息"));
  }

  async function checkDateList2() {
    const { _items2 } = await form.getFieldsValue();
    if (Object.values(_items2).every((item) => item)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请完善时间段票数信息"));
  }

  function makeParams(values) {
    const { date, warningLeftQuantity, _items1, _items2 } = values;
    const [start, end] = date;
    let items = [];

    if (_items1) {
      items = Object.values(_items1).map((item) => ({
        clientType: 1,
        timeItemId: item[0],
        maxTouristsQuantity: item[1],
        warningLeftQuantity,
      }));
    }
    if (_items2) {
      items = [
        ...items,
        ...Object.values(_items2).map((item) => ({
          clientType: 2,
          timeItemId: item[0],
          maxTouristsQuantity: item[1],
          warningLeftQuantity,
        })),
      ];
    }

    return {
      isSpecial: true,
      startReserveDate: start.format(dateFormat),
      endReserveDate: end.format(dateFormat),
      items,
      date: undefined,
      _items1: undefined,
      _items2: undefined,
    };
  }

  function makeDefaultValues() {
    const {
      maxTouristsQuantity,
      startReserveDate,
      endReserveDate,
      timeItems,
      id,
    } = defaultValues;

    if (!id) {
      return {};
    }
    return {
      maxTouristsQuantity,
      date: [
        moment(startReserveDate, dateFormat),
        moment(endReserveDate, dateFormat),
      ],
    };
  }

  return (
    <>
      <Form
        form={form}
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues()}
      >
        <Form.Item
          label="开始/截至日期"
          name="date"
          rules={[{ required: true, message: "请选择日期" }]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item
          label="个人时间段票数"
          style={{ marginBottom: 12 }}
          name="_items1"
          className="form-item-list"
          rules={[{ validator: checkDateList1 }]}
        >
          <FormList name="items1" pickerOptions={datePickerOptions} />
        </Form.Item>
        <Form.Item
          label="团体时间段票数"
          style={{ marginBottom: 12 }}
          name="_items2"
          className="form-item-list"
          rules={[{ validator: checkDateList2 }]}
        >
          <FormList name="items2" pickerOptions={datePickerOptions} />
        </Form.Item>
        <Form.Item label="库存提示">
          <Space>
            <span>数量低于</span>
            <Form.Item name="warningLeftQuantity" style={{ marginBottom: 0 }}>
              <InputNumber placeholder="0" min="0" />
            </Form.Item>
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
