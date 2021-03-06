import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Skeleton,
  Space,
} from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import utils from '../../shared/utils';
import UploadImage from '../UI/UploadImage';
import { datePickerOptions } from '../../shared/options';
import commonService from '../../services/common.service';
import faciliyService from '../../services/faciliy.service';
import FormList from './FormList';
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [datePickerOptions, setDatePickerOptions] = useState([]);
  useEffect(() => {
    let mounted = true;

    loadData();

    async function loadData() {
      try {
        const { items } = await faciliyService.getReservationTimeItemOptions();
        const options = items.map((item) => ({
          label: item.displayText,
          value: item.id,
        }));

        if (mounted) {
          setDatePickerOptions(options);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [defaultValues.id]);

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await faciliyService.updateReservationTimeSetting({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await faciliyService.addReservationTimeSetting(
          makeParams(values),
        );
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  async function checkDateList1() {
    const { _items1 } = await form.getFieldsValue();
    if (_items1 && Object.values(_items1).every((item) => item)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请完善时间段票数信息'));
  }

  async function checkDateList2() {
    const { _items2 } = await form.getFieldsValue();
    if (_items2 && Object.values(_items2).every((item) => item)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请完善时间段票数信息'));
  }

  function makeParams(values) {
    const { date, warningLeftQuantity, _items1, _items2 } = values;

    let startReserveDate = '';
    let endReserveDate = '';
    if (defaultValues.isSpecial) {
      startReserveDate = defaultValues.dateTitle;
      endReserveDate = defaultValues.dateTitle;
    } else {
      const [start, end] = date;
      startReserveDate = start.format(dateFormat);
      endReserveDate = end.format(dateFormat);
    }

    let items = [];

    if (_items1) {
      items = Object.values(_items1).map((item) => ({
        ...item,
        clientType: 1,
        warningLeftQuantity,
      }));
    }
    if (_items2) {
      items = [
        ...items,
        ...Object.values(_items2).map((item) => ({
          ...item,
          clientType: 2,
          warningLeftQuantity,
        })),
      ];
    }

    return {
      isSpecial: defaultValues.isSpecial,
      startReserveDate,
      endReserveDate,
      items,
      date: undefined,
      _items1: undefined,
      _items2: undefined,
    };
  }

  function splitTimeData(data) {
    if (!data) {
      return [[], []];
    }
    return data.reduce(
      (result, item) => {
        const {
          individualMaxTouristsQuantity,
          groupMaxTouristsQuantity,
          timeItemId,
        } = item;
        if (individualMaxTouristsQuantity) {
          result[0].push({
            timeItemId,
            maxTouristsQuantity: individualMaxTouristsQuantity,
          });
        }
        if (groupMaxTouristsQuantity) {
          result[1].push({
            timeItemId,
            maxTouristsQuantity: groupMaxTouristsQuantity,
          });
        }
        return result;
      },
      [[], []],
    );
  }

  function makeDefaultValues(values) {
    const {
      isSpecial,
      dateTitle,
      maxTouristsQuantity,
      startReserveDate,
      endReserveDate,
      warningLeftQuantity,
      timeItems,
      timeRanges,
      id,
    } = values;

    if (!id) {
      return {};
    }
    const [_items1, _items2] = splitTimeData(timeItems || timeRanges);

    return {
      _items1,
      _items2,
      maxTouristsQuantity,
      warningLeftQuantity,
      date: isSpecial
        ? [moment(dateTitle, dateFormat), moment(dateTitle, dateFormat)]
        : [
            moment(startReserveDate, dateFormat),
            moment(endReserveDate, dateFormat),
          ],
    };
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      <Form
        name='update-form'
        form={form}
        {...layout}
        size='small'
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}>
        <Form.Item
          label='开始/截至日期'
          name='date'
          rules={[{ required: true, message: '请选择日期' }]}>
          <RangePicker disabled={defaultValues.id} />
        </Form.Item>

        <Form.Item
          label='个人时间段票数'
          style={{ marginBottom: 12 }}
          name='_items1'
          className='form-item-list'
          required
          rules={[{ validator: checkDateList1 }]}>
          <FormList name='items1' pickerOptions={datePickerOptions} />
        </Form.Item>
        <Form.Item
          label='团体时间段票数'
          style={{ marginBottom: 12 }}
          name='_items2'
          required
          className='form-item-list'
          rules={[{ validator: checkDateList2 }]}>
          <FormList name='items2' pickerOptions={datePickerOptions} />
        </Form.Item>
        <Form.Item label='库存提示'>
          <Space>
            <span>数量低于</span>
            <Form.Item name='warningLeftQuantity' style={{ marginBottom: 0 }}>
              <InputNumber placeholder='0' min='0' />
            </Form.Item>
            <span>提示“余票过少”</span>
          </Space>
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
