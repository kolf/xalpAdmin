import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, Select, Checkbox } from "antd";
import utils from "../../shared/utils";
import userService from "../../services/user.service";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  const [providerOptions, setProviderOptions] = useState([]);
  useEffect(() => {
    if (providerOptions.length === 0) {
      loadData();
    }
  }, [JSON.stringify(providerOptions)]);

  async function loadData() {
    try {
      const res = await userService.getAllPermissions({ providerName: "R" });
      if (defaultValues.name) {
        const res1 = await userService.getAllPermissions({
          providerName: "R",
          providerKey: defaultValues.name,
        });
        console.log(res1, 'res1')
      }

      const options = res.groups
        .find((item) => item.name === "SmartTicketing")
        .permissions.map((item) => ({
          label: item.displayName,
          value: item.name,
        }));

      setProviderOptions(options);
    } catch (error) {}
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await userService.updateRole({
          ...makeParams(values),
          id: defaultValues.id,
          concurrencyStamp: defaultValues.concurrencyStamp,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await userService.addRole(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        isPublic: true,
        isDefault: false,
      }
    );
  }

  function makeDefaultValues() {
    return Object.keys(defaultValues).reduce((result, key) => {
      const value = defaultValues[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }
  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item label="角色名称" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="权限设置" name="providerKey">
          <Checkbox.Group options={providerOptions} />
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
