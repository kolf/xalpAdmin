import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import moment from "moment";
import utils from "../../shared/utils";

import commonService from "../../services/common.service";
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 14 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const [merchantOptions, setMerchantOptions] = useState([]);
  useEffect(() => {
    if (merchantOptions.length === 0) {
      loadData();
    }
  }, [JSON.stringify(merchantOptions)]);

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
      return { value: item.id, label: item.displayText };
    });
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.startPermissionDate = start.format(dateFormat);
        result.endPermissionDate = end.format(dateFormat);
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await faciliyService.updateMerchant(
          makeParams({
            ...values,
            id: defaultValues.id,
          })
        );
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await faciliyService.addMerchant(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    const {
      name,
      handlerName,
      handlerPhone,
      merchantTypeId,
      startPermissionDate,
      endPermissionDate,
    } = values;

    return {
      name,
      handlerName,
      handlerPhone,
      merchantTypeId,
      date: [
        moment(startPermissionDate, dateFormat),
        moment(endPermissionDate, dateFormat),
      ],
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
