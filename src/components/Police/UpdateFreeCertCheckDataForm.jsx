import React, { useState } from "react";
import { Form, Input, Radio, Select, Button } from "antd";
import {
  deviceActiveOptions,
  isEnableFreeCertCheckOptions,
  enterOptions,
  isFireModeOpenOptions,
} from "../../shared/options";
import utils from "../../shared/utils";
import policeService from "../../services/police.service";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ onOk }) {
  async function onFinish(values) {
    try {
      const res = await policeService.switchCertCheck(makeParams(values));
      utils.success(`更新成功！`);
      onOk && onOk(res);
    } catch (error) {
      utils.error(`更新失败！`);
    }
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === "isEnableFreeCertCheck") {
        result.isEnableFreeCertCheck = value === "1";
      }
      return result;
    }, {});
  }

  return (
    <>
      <Form {...layout} size="small" onFinish={onFinish}>
        <Form.Item
          label="无预约入园"
          name="isEnableFreeCertCheck"
          rules={[{ required: true, message: "请选择无预约入园！" }]}
        >
          <Radio.Group>
            {isEnableFreeCertCheckOptions.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </Radio.Group>
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
