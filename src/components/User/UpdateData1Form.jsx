import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Skeleton } from 'antd';
import { useRequest } from 'ahooks';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import sessionService from '../../services/session.service';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  const { data, loading, error } = useRequest(
    async () => {
      try {
        const res = await Promise.all([
          userService.getAllRole(),
          userService.getOrgList({
            skipCount: '0',
            maxResultCount: '100',
          }),
        ]);
        return [
          res[0].items.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          res[1].items.map((item) => ({
            label: item.displayName,
            value: item.id,
          })),
        ];
      } catch (error) {
        return [[], []];
      }
    },
    {
      throwOnError: true,
      initialData: [[], []],
    },
  );

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

        if (sessionService.isUserName(defaultValues.userName)) {
          await sessionService.updateRoles();
          window.location.reload();
          return;
        }
      } catch (error) {}
    } else {
      try {
        res = await userService.addUser(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
    // window.location.reload();
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function makeDefaultValues() {
    const { id, roleNames, organizationUnitId } = defaultValues;
    if (!id) {
      return {};
    }
    return { roleNames, organizationUnitId };
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
          label='选择角色'
          name='roleNames'
          rules={[{ required: true, message: '请选择角色！' }]}>
          <Select placeholder='请选择' mode='multiple' allowClear>
            {data[0].map((o) => (
              <Option value={o.label} key={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
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
