import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, Skeleton, Checkbox } from "antd";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (providerOptions.length === 0) {
      loadData();
    }

    async function loadData() {
      try {
        let res = null;
        if (defaultValues.name) {
          res = await userService.getAllPermissions({
            providerName: "R",
            providerKey: defaultValues.name,
          });
        } else {
          res = await userService.getAllPermissions({ providerName: "R" });
        }

        const options = res.groups
          .find((item) => item.name === "SmartTicketing")
          .permissions.map((item) => {
            return {
              label: item.displayName,
              value: item.name,
            };
          });

        if(mounted){
          setProviderOptions(options);
        setLoading(false);
        }
      } catch (error) {
        if(mounted){
          setLoading(false);
        }
      }
    }
    return () => {
      mounted = false;
    };
  }, [JSON.stringify(providerOptions)]);

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await userService.updateRole({
          ...makeParams(values),
          id: defaultValues.id,
          providerKey: values.name || defaultValues.name,
          concurrencyStamp: defaultValues.concurrencyStamp,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await userService.addRole({
          ...makeParams(values),
          providerKey: values.name,
        });
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

  function makeDefaultValues(values) {
    if (!values.name) {
      return {};
    }

    return Object.keys(values).reduce((result, key) => {
      console.log(result,key)
      const value = values[key];
      if (key === "permissions") {
        result[key] = providerOptions
          .filter((o) => values.permissions.find((v) => v === o.label))
          .map((o) => o.value);
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  if (loading) {
    return <Skeleton></Skeleton>;
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: "请输入角色名称！" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="权限设置"
          name="permissions"
          rules={[{ required: true, message: "请选择权限！" }]}
        >
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
