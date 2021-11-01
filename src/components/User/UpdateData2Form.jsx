import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Skeleton, Checkbox } from 'antd';
import PermissionsCheckbox from './PermissionsCheckbox';
import { useRequest } from 'ahooks';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import sessionService from '../../services/session.service';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  const { data = [], loading } = useRequest(
    () => {
      if (defaultValues.name) {
        return userService.getAllPermissions({
          providerName: 'R',
          providerKey: defaultValues.name,
        });
      } else {
        return userService.getAllPermissions({ providerName: 'R' });
      }
    },
    {
      throwOnError: true,
    },
  );

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
        if (sessionService.isUserRoles(defaultValues.name)) {
          await sessionService.updateRoles();
          window.location.reload();
          return;
        }
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

  function makeData(data) {
    return data.reduce((result, o) => {
      if (o.permissions && o.permissions.length > 0) {
        result = [
          ...result,
          ...o.permissions.map((i) => ({
            label: i.displayName,
            value: i.name,
            isGranted: i.isGranted,
            parentValue: i.parentName,
          })),
        ];
      }
      return result;
    }, []);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (value !== undefined && value !== '-1') {
          result[key] = value;
        }
        return result;
      },
      {
        isPublic: true,
        isDefault: false,
      },
    );
  }

  function makeDefaultValues(values) {
    if (!values.name) {
      return {};
    }

    const options = makeData(data.groups);

    console.log(options, values.name, 'values');

    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === 'permissions') {
        // console.log(values.permissions, 'values.permissions');
        result[key] = options
          .filter(
            (o) => o.isGranted && values.permissions.find((v) => v === o.label),
          )
          .map((o) => o.value);
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      <Form
        {...layout}
        size='small'
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}>
        <Form.Item
          label='角色名称'
          name='name'
          rules={[{ required: true, message: '请输入角色名称！' }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          label='权限设置'
          name='permissions'
          rules={[{ required: true, message: '请选择权限！' }]}>
          <PermissionsCheckbox dataSource={makeData(data.groups)} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            确定
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
