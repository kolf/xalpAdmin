import React from "react";
import { InputNumber, Space } from "antd";

export default function InputGroup({ value = [], onChange }) {
  function handleChange(index, newValue) {
    let propsValue = [...value];
    propsValue[index] = newValue;
    onChange(propsValue);
  }
  return (
    <Space>
      <InputNumber
        min={0}
        max={value[1]}
        value={value[0]}
        onChange={(e) => handleChange(0, e)}
        placeholder="最少人数"
      />
      <span>-</span>
      <InputNumber
        min={value[0]}
        value={value[1]}
        onChange={(e) => handleChange(1, e)}
        placeholder="最多人数"
      />
    </Space>
  );
}
