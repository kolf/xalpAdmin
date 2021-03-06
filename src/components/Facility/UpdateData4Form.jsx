import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Skeleton } from 'antd';
import { useRequest } from 'ahooks';
import UploadImage from '../UI/UploadImage';
import moment from 'moment';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import faciliyService from '../../services/faciliy.service';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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
        return res.items.map((item) => ({
          label: item.displayName,
          value: item.id,
        }));
      },
    },
  );

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await faciliyService.updateStaff({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await faciliyService.addStaff(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === 'date' && value) {
          const [start, end] = value;
          result.startPermissionDate = start.format(dateFormat);
          result.endPermissionDate = end.format(dateFormat);
        } else if (key === 'tempFaceFileName' && /^http/.test(value)) {
        } else if (value !== undefined && value !== '-1') {
          result[key] = value;
        }
        return result;
      },
      {
        staffType: 2,
      },
    );
  }

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    const {
      jobNumber,
      name,
      organizationUnit,
      phone,
      certNumber,
      tempFaceFileName,
      webUrl,
      startCardTime,
      endCardTime,
      departmentId,
    } = values;

    return {
      jobNumber,
      name,
      organizationUnit,
      phone,
      certNumber,
      tempFaceFileName,
      tempFaceFileName: webUrl,
      departmentId,
      date: [
        moment(startCardTime, dateFormat),
        moment(endCardTime, dateFormat),
      ],
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
        <Form.Item label='所属部门' name='departmentId'>
          <Select placeholder='请选择所属部门'>
            {options.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='工号'
          name='jobNumber'
          rules={[{ required: true, message: '请输入工号！' }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          label='姓名'
          name='name'
          rules={[{ required: true, message: '请输入姓名！' }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          label='岗位'
          name='organizationUnit'
          rules={[{ required: true, message: '请输入岗位！' }]}>
          <Input placeholder='请输入' />
        </Form.Item>

        <Form.Item
          label='电话'
          name='phone'
          rules={[{ required: true, message: '请输入电话' }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          label='证件号码'
          name='certNumber'
          rules={[{ required: true, message: '请输入证件号码！' }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          label='照片'
          name='tempFaceFileName'
          rules={[{ required: true, message: '请上传照片！' }]}>
          <UploadImage />
        </Form.Item>
        <Form.Item
          label='有效入园时间段'
          name='date'
          rules={[{ required: true, message: '请选择时间段！' }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type='primary'
            htmlType='submit'
            rules={[{ required: true, message: '请输入' }]}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
