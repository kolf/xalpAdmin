import React, { useState } from 'react';
import { Form, Input, Skeleton, Select, Button } from 'antd';
import { useRequest } from 'ahooks';
import utils from '../../shared/utils';
import policeService from '../../services/police.service';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ onOk, defaultValues = {} }) {
  const [form] = Form.useForm();
  const { loading, data } = useRequest(
    () =>
      policeService.getAllCamera({
        userStatus: 1,
      }),
    {
      throwOnError: true,
      initialData: [],
      formatResult(res) {
        return res
          .filter(
            (item) =>
              item.userStatus === '1' ||
              item.deviceId === defaultValues.deviceId,
          )
          .map((item) => ({
            label: item.name,
            value: item.deviceId,
          }));
      },
    },
  );

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      res = await policeService.updateCamera({
        ...makeParams(values),
        id: defaultValues.id,
      });
      utils.success(`更新成功！`);
    } else {
      res = await policeService.addCamera(makeParams(values));
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
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

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    const { deviceId, adminName, adminPhone } = values;

    return {
      deviceId,
      adminName,
      adminPhone,
    };
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Form
      {...layout}
      form={form}
      size='small'
      onFinish={onFinish}
      initialValues={makeDefaultValues(defaultValues)}>
      <Form.Item
        label='选择设备'
        name='deviceId'
        rules={[{ required: true, message: '请选择设备！' }]}>
        <Select
          placeholder='请选择设备'
          disabled={defaultValues.id}
          allowClear
          showSearch
          optionFilterProp='children'
          filterOption={(input, option) => {
            return (
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }}>
          {data.map((o) => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='管理人姓名'
        name='adminName'
        rules={[{ required: true, message: '请输入管理人姓名！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='管理员电话'
        name='adminPhone'
        rules={[{ required: true, message: '请输入管理员电话！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}
