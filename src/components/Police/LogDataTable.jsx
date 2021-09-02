import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';

import moment from 'moment';
import policeService from '../../services/police.service';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const secFormat = 'YYYY-MM-DD HH:mm:ss';

const initialData = {
  totalCount: 0,
  items: [],
};

export default function DataTable({ id }) {
  const [form] = Form.useForm();

  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
  });

  const { data = initialData, loading } = useRequest(
    () => policeService.getDeviceLogList(makeQuery(query)),
    {
      refreshDeps: [query],
      throwOnError: true,
    },
  );

  function makeData(data) {
    return data.map((item, index) => {
      return { ...item, ...item.deviceInteractionLog, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (key === 'date' && value) {
          const [start, end] = value;
          result.StartTime = start.format(dateFormat) + ' 00:00:00';
          result.EndTime = end.format(dateFormat) + ' 23:59:59';
        } else if (value !== undefined && value !== '-1') {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        DeviceId: id,
      },
    );
  }

  const columns = [
    {
      title: '设备IP地址',
      dataIndex: 'deviceIP',
    },
    {
      title: '日志时间',
      dataIndex: 'interactionTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '';
      },
    },
    {
      title: '日志详情',
      dataIndex: 'logContent',
    },
  ];

  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total: data.totalCount,
    position: ['', 'bottomCenter'],
    size: 'small',
    onChange(pageNum, pageSize) {
      let nextPageNum = pageNum;
      if (pageSize !== query.maxResultCount * 1) {
        nextPageNum = 1;
      }

      setQuery({
        ...query,
        skipCount: nextPageNum + '',
        maxResultCount: pageSize + '',
      });
    },
  };

  return (
    <div>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={(values) =>
          setQuery({ ...query, ...values, skipCount: '1' })
        }>
        <Form.Item name='date'>
          <RangePicker size='small' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' size='small'>
            查询数据
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey='id'
        dataSource={makeData(data.items)}
        columns={columns}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
      />
    </div>
  );
}
