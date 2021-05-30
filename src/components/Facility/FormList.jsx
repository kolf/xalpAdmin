import React, { useState, useEffect } from "react";
import { Form, InputNumber, Space, Select } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function createId(name) {
  return name + "-uid" + (Math.random() + "").replace(".", "");
}

export default function FormList({ pickerOptions = [], name, onChange }) {
  const [fields, setFields] = useState([createId(name)]);

  function add() {
    setFields([...fields, createId(name)]);
  }

  function remove(fieldKey) {
    const nextFields = fields.filter((field) => {
      return field !== fieldKey;
    });
    setFields(nextFields);
  }

  function onFieldsChange(field, allField) {
    const propValues = allField.reduce((result, item) => {
      const { name: names, value } = item;
      const [uid, index] = names[0].split("_");
      result[uid] = [];
      result[uid][index] = value;
      return result;
    }, {});
    onChange(propValues);
  }

  return (
    <Form onFieldsChange={onFieldsChange}>
      {fields.map((field, index) => {
        return (
          <Space
            style={{
              display: "flex",
              marginBottom: index + 1 === fields.length ? 12 : 6,
            }}
            align="baseline"
          >
            <Form.Item name={field + "_0"}>
              <Select style={{ width: 160 }} placeholder="请选择时间段">
                {pickerOptions.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name={field + "_1"}>
              <InputNumber placeholder="0" min="0" />
            </Form.Item>
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
    </Form>
  );
  //   return (
  //     <Form.List name="_list">
  //       {(fields, { add, remove }) => (
  //         <>
  //           <Space
  //             style={{
  //               display: "flex",
  //               marginBottom: fields.length === 0 ? 12 : 6,
  //             }}
  //             align="baseline"
  //           >
  //             <Form.Item name="timeItemId-add">
  //               <Select style={{ width: 160 }} placeholder="请选择时间段">
  //                 {pickerOptions.map((o) => (
  //                   <Option key={o.value} value={o.value}>
  //                     {o.label}
  //                   </Option>
  //                 ))}
  //               </Select>
  //             </Form.Item>
  //             <Form.Item name="maxTouristsQuantity-add">
  //               <InputNumber placeholder="0" min="0" />
  //             </Form.Item>
  //             <PlusCircleOutlined
  //               onClick={(e) => (fields.length < 2 ? add() : null)}
  //             />
  //           </Space>
  //           {fields.map(({ key, name, fieldKey, ...restField }, index) => {
  //             console.log(key, name, fieldKey, restField, "items1");
  //             return (
  //               <Space
  //                 key={key}
  //                 style={{
  //                   display: "flex",
  //                   marginBottom: index + 1 === fields.length ? 12 : 6,
  //                 }}
  //                 align="baseline"
  //               >
  //                 <Form.Item
  //                   {...restField}
  //                   name={[name, "timeItemId"]}
  //                   fieldKey={[fieldKey, "timeItemId"]}
  //                 >
  //                   <Select style={{ width: 160 }} placeholder="请选择时间段">
  //                     {pickerOptions.map((o) => (
  //                       <Option key={o.value} value={o.value}>
  //                         {o.label}
  //                       </Option>
  //                     ))}
  //                   </Select>
  //                 </Form.Item>
  //                 <Form.Item
  //                   {...restField}
  //                   name={[name, "maxTouristsQuantity"]}
  //                   fieldKey={[fieldKey, "maxTouristsQuantity"]}
  //                 >
  //                   <InputNumber placeholder="0" min="0" />
  //                 </Form.Item>
  //                 <MinusCircleOutlined onClick={() => remove(name)} />
  //               </Space>
  //             );
  //           })}
  //         </>
  //       )}
  //     </Form.List>
  //   );
}
