import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, Select } from "antd";
import utils from "../../shared/utils";
import userService from "../../services/user.service";

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (roleOptions.length === 0) {
      loadData();
    }

    async function loadData() {
      try {
        const { items } = await userService.getAllRole();
        if(mounted){
          setRoleOptions(
            items.map((item) => ({
              label: item.name,
              value: item.id,
              concurrencyStamp: item.concurrencyStamp,
            }))
          );
        }
      } catch (error) {}
    }
    return () => {
      mounted = false;
    };
  }, [JSON.stringify(roleOptions)]);

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await userService.updateUser({
          ...makeParams(values),
          id: defaultValues.id,
          concurrencyStamp: defaultValues.concurrencyStamp,
          userName: defaultValues.userName,
        });
        utils.success(`更新成功！`);
      } catch (error) {

      }
    } else {
      try {
        res = await userService.addUser(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {

      }
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function makeDefaultValues() {
    const { id, roleNames } = defaultValues;
    if (!id) {
      return {};
    }
    return { roleNames };
  }
  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item label="选择角色" name="roleNames" rules={[{ required: true, message: "请选择角色！" }]}>
          <Select placeholder="请选择" mode="multiple" allowClear>
            {roleOptions.map((o) => (
              <Option value={o.label} key={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
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
