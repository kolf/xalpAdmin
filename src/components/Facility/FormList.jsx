import React, { useState, useEffect } from "react";
import { Form, InputNumber, Space, Select } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function createId(name) {
  return (
    name + "-uid" + Date.now() + "" + (Math.random() + "").replace(".", "")
  );
}

function createFields(name, value) {
  if (value && value.length === 0) {
    return [createId(name)];
  }
  return value.map((v) => createId(name));
}

function FormList({ pickerOptions = [], name, onChange, value = [] }) {
  const [fields, setFields] = useState(createFields(name, value));

  function add() {
    setFields([...fields, createId(name)]);
  }

  function remove(fieldKey) {
    const nextFields = fields.filter((field) => {
      return field !== fieldKey;
    });
    setFields(nextFields);
  }

  function handleChange(field, name, newValue) {
    const index = fields.findIndex((f) => f === field);
    value[index] = value[index]
      ? {
          ...value[index],
          [name]: newValue,
        }
      : { [name]: newValue };
    onChange(value);
  }

  if (fields.length === 0) {
    return null;
  }

  return (
    <div>
      {fields.map((field, index) => {
        return (
          <Space
            key={field}
            style={{
              display: "flex",
              marginBottom: index + 1 === fields.length ? 12 : 6,
            }}
            align="baseline"
          >
            <div>
              <Select
                style={{ width: 160 }}
                placeholder="请选择时间段"
                value={value[index] ? value[index].timeItemId : undefined}
                onChange={(v) => handleChange(field, "timeItemId", v)}
              >
                {pickerOptions.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <InputNumber
                placeholder="0"
                value={
                  value[index] ? value[index].maxTouristsQuantity : undefined
                }
                min="0"
                onChange={(v) => handleChange(field, "maxTouristsQuantity", v)}
              />
            </div>
            {index === 0 ? (
              <PlusCircleOutlined
                onClick={(e) => (fields.length < 3 ? add() : null)}
              />
            ) : (
              <MinusCircleOutlined onClick={() => remove(field)} />
            )}
          </Space>
        );
      })}
    </div>
  );
}

export default React.memo(FormList);
