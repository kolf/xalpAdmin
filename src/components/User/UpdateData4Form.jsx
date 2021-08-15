import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Skeleton, message } from 'antd';
import { useRequest } from 'ahooks';
import utils from '../../shared/utils';
import userService from '../../services/user.service';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 14 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const {
    loading,
    data: options,
    error,
  } = useRequest(
    () =>
      userService.getOrgList({
        skipCount: '0',
        maxResultCount: '100',
      }),
    {
      throwOnError: true,
      initialData: [],
      formatResult(res) {
        let result = res.items.map((item) => ({
          label: item.displayName,
          value: item.id,
        }));
        if (defaultValues.id) {
          result = result.filter((o) => o.value !== defaultValues.id);
        }
        return result;
      },
    },
  );

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  async function onFinish(values) {
    let res = null;

    if (defaultValues.id) {
      try {
        res = await userService.updateOrg(
          makeParams({
            ...values,
            concurrencyStamp: defaultValues.concurrencyStamp,
            id: defaultValues.id,
          }),
        );
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await userService.addOrg(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    const { displayName, parentId } = values;

    return {
      displayName,
      parentId,
    };
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
          label='部门名称'
          name='displayName'
          rules={[{ required: true, message: '请输入部门名称！' }]}>
          <Input placeholder='请输入部门名称' />
        </Form.Item>

        <Form.Item label='上级部门' name='parentId'>
          <Select placeholder='请选择上级部门' _disabled={defaultValues.id}>
            {options.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
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
