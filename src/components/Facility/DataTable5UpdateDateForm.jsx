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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import utils from "../../shared/utils";
import UploadImage from "../UI/UploadImage";
import { datePickerOptions } from "../../shared/options";
import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
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
    console.log(defaultValues, "defaultValues");
    loadData();
  }, []);

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
    const { date } = values;
    const [start, end] = date;

    let params = {
      ...values,
      startReserveDate: start.format(dateFormat),
      endReserveDate: end.format(dateFormat),
    };
    let res = null;
    if (defaultValues.id) {
      params.id = defaultValues.id;
      res = await faciliyService.updateReservationTimeSetting(params);
      utils.success(`更新成功！`);
    } else {
      res = await faciliyService.addReservationTimeSetting(params);
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  async function checkDateList() {
    const { items } = await form.getFieldsValue();
    if (
      items &&
      items.filter(
        (item) => item && item.timeItemId && !isNaN(item.maxTouristsQuantity)
      ).length > 0
    ) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请完善时间段票数信息"));
  }

  function makeDefaultValues() {
    const {
      maxTouristsQuantity,
      startReserveDate,
      endReserveDate,
      timeItems,
      id
    } = defaultValues;

    if(!id){
      return {}
    }
    return {
      maxTouristsQuantity,
      items: timeItems,
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
          label="时间段票数"
          style={{ marginBottom: 0 }}
          name="_timeItems"
          rules={[{ validator: checkDateList }]}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 0 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "timeItemId"]}
                      fieldKey={[fieldKey, "timeItemId"]}
                    >
                      <Select style={{ width: 160 }} placeholder="请选择时间段">
                        {datePickerOptions.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "maxTouristsQuantity"]}
                      fieldKey={[fieldKey, "maxTouristsQuantity"]}
                    >
                      <InputNumber placeholder="0" min="0" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                {fields.length < 3 && (
                  <Form.Item>
                    <Button
                      onClick={() => add()}
                      style={{ width: 258 }}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="库存提示">
          <Space>
            <span>数量低于</span>
            <Form.Item name="maxTouristsQuantity" style={{ marginBottom: 0 }}>
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
