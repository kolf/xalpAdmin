import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Empty,
  Pagination,
  message,
} from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import modal from '../../shared/modal';
import policeService from '../../services/police.service';
import dataService from '../../services/data.service';
const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';

const initialData = {
  totalCount: 0,
  items: [],
};

export default React.memo(function DataTable() {
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
    date: [moment(), moment()],
  });

  const {
    data = initialData,
    run,
    loading,
  } = useRequest(() => policeService.getDeviceInOutCount(makeQuery(query)), {
    refreshDeps: [query],
  });

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === 'date' && value) {
        const [start, end] = value;
        result.startDateTime = start.format(dateFormat) + ' 00:00:00';
        result.endDateTime = end.format(dateFormat) + ' 23:59:59';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  async function openFile() {
    try {
      const res1 = await dataService.exportDeviceInOutRecords(makeQuery(query));
      window.open(res1);
    } catch (error) {
      message.error(`导出失败！`);
    }
  }

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '入园人数',
      dataIndex: 'inCount',
    },
    {
      title: '出园人数',
      dataIndex: 'outCount',
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
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'></Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Button
            size='small'
            type='primary'
            onClick={openFile}
            disabled={!data || data.length === 0}>
            下载数据
          </Button>
        </Col>
      </Row>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values })}
        initialValues={query}>
        <Form.Item name='date'>
          <RangePicker size='small' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='small'>
            查询数据
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            size='small'
            placeholder='请输入设备名称查询'
            allowClear
            onSearch={(value) => setQuery({ ...query, keyword: value })}
          />
        </Form.Item>
      </Form>

      <Table
        dataSource={makeData(data.items)}
        columns={columns}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
        rowKey='id'
      />
    </div>
  );
});
