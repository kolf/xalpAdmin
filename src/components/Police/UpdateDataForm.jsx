import React, { useState } from 'react';
import { Form, Input, Radio, Select, Button } from 'antd';
import {
  deviceActiveOptions,
  isEnableFreeCertCheckOptions,
  enterOptions,
  isFireModeOpenOptions,
} from '../../shared/options';
import utils from '../../shared/utils';
import policeService from '../../services/police.service';

const coordinateReg = /^\d+\.\d+[,，]\d+\.\d+$/g;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({
  onOk,
  defaultValues = {},
  checkDeviceType,
}) {
  const [form] = Form.useForm();

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      res = await policeService.updateDevice({
        ...makeParams(values),
        id: defaultValues.id,
      });
      utils.success(`更新成功！`);
    } else {
      res = await policeService.addDevice(makeParams(values));
      utils.success(`添加成功！`);
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === 'isActive') {
          result.isActive = value === '1';
        } else if (key === 'isDirectionEnter') {
          result.isDirectionEnter = value === '1';
        } else if (key === 'isFireModeOpen') {
          result.isFireModeOpen = value === '1';
        } else if (key === 'isEnableFreeCertCheck') {
          result.isEnableFreeCertCheck = value === '1';
        } else if (key === 'coordinate') {
          const [longitude, latitude] = value.split(/,|，/);
          result.longitude = longitude;
          result.latitude = latitude;
        } else if (value !== undefined && value !== '-1') {
          result[key] = value;
        }
        return result;
      },
      {
        deviceType: 1,
        checkDeviceType,
      },
    );
  }

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === 'isActive') {
        result.isActive = value ? '1' : '0';
      } else if (key === 'isDirectionEnter') {
        result.isDirectionEnter = value ? '1' : '0';
      } else if (key === 'isFireModeOpen') {
        result.isFireModeOpen = value ? '1' : '0';
      } else if (key === 'isEnableFreeCertCheck') {
        result.isEnableFreeCertCheck = value ? '1' : '0';
      } else if (/^(checkDeviceType)$/.test(key)) {
        result[key] = value + '';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      } else if (/^(longitude|latitude)/.test(key)) {
        result[key] = undefined;
      }
      result.coordinate = values.longitude + '，' + values.latitude;

      return result;
    }, {});
  }

  async function validatorCoordinate(rule, value, callback) {
    if (coordinateReg.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入正确的经纬度！'));
  }

  return (
    <Form
      {...layout}
      form={form}
      size='small'
      onFinish={onFinish}
      initialValues={makeDefaultValues(defaultValues)}>
      <Form.Item
        label='设备名称'
        name='name'
        rules={[{ required: true, message: '请输入设备名称！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='设备编号'
        name='code'
        rules={[{ required: true, message: '请输入设备编号！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='设备IP地址'
        name='ipAddress'
        rules={[{ required: true, message: '请输入设备IP地址！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      {checkDeviceType === '1' && (
        <Form.Item
          label='设备经纬度'
          name='coordinate'
          rules={[
            { required: true, message: '请输入经纬度！' },
            { validator: validatorCoordinate },
          ]}>
          <Input placeholder='前面经度、后面纬度，用逗号分隔！' />
        </Form.Item>
      )}
      {defaultValues.id && (
        <Form.Item label='录入人员姓名' name='creatorName'>
          <Input readOnly placeholder='未知' />
        </Form.Item>
      )}
      {defaultValues.id && (
        <Form.Item label='录入人工号' name='creatorJobNumber'>
          <Input readOnly placeholder='未知' />
        </Form.Item>
      )}
      {defaultValues.id && (
        <Form.Item label='录入人员电话' name='creatorPhone'>
          <Input readOnly placeholder='未知' />
        </Form.Item>
      )}
      <Form.Item
        label='管理人姓名'
        name='handlerName'
        rules={[{ required: true, message: '请输入管理人姓名！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='管理员电话'
        name='handlerPhone'
        rules={[{ required: true, message: '请输入管理员电话！' }]}>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='设备状态'
        name='isActive'
        rules={[{ required: true, message: '请选择设备状态！' }]}>
        <Radio.Group>
          {deviceActiveOptions.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label='出入口状态'
        name='isDirectionEnter'
        rules={[{ required: true, message: '请选择出入口状态！' }]}>
        <Radio.Group>
          {enterOptions.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {checkDeviceType === '1' && [
        <Form.Item
          label='消防模式'
          name='isFireModeOpen'
          rules={[{ required: true, message: '请选择消防模式！' }]}>
          <Radio.Group>
            {isFireModeOpenOptions.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>,
        <Form.Item
          label='无预约入园'
          name='isEnableFreeCertCheck'
          rules={[{ required: true, message: '请选择无预约入园！' }]}>
          <Radio.Group>
            {isEnableFreeCertCheckOptions.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>,
      ]}
      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}
