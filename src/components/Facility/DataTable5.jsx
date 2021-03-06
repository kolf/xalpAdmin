import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Select,
  Pagination,
  Image,
  message,
} from 'antd';
import { useRequest } from 'ahooks';
import moment from 'moment';
import faciliyService from '../../services/faciliy.service';
import dataService from '../../services/data.service';
import {
  staffTypeEnum,
  staffTypeOptions,
  checkModeEnum,
} from '../../shared/options';
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const secFormat = 'YYYY-MM-DD HH:mm:ss';

const initialData = {
  totalCount: 0,
  items: [],
};

export default function DataTable() {
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
    date: [moment(), moment()],
  });

  const { data = initialData, loading } = useRequest(
    () => faciliyService.getStaffCheckRecords(makeQuery(query)),
    {
      refreshDeps: [query],
      throwOnError: true,
    },
  );

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return {
        ...item,
        ...item.checkRecord,
      };
    });
  }

  function makeQuery(query) {
    console.log(query, 'query');
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === 'date' && value) {
        const [start, end] = value;
        result.StartDateTime = start.format(dateFormat) + ' 00:00:00';
        result.EndDateTime = end.format(dateFormat) + ' 23:59:59';
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
      const res = await dataService.exportStaffCheckRecords(makeQuery(query));
      window.open(res);
    } catch (error) {}
  }

  const columns = [
    {
      title: '??????',
      dataIndex: 'jobNumber',
    },
    {
      title: '??????',
      dataIndex: 'staffName',
    },
    {
      title: '????????????',
      dataIndex: 'phone',
    },
    {
      title: '????????????',
      dataIndex: 'certNumber',
    },
    {
      title: '????????????',
      dataIndex: 'staffType',
      render(text) {
        return staffTypeEnum[text] || '??????';
      },
    },
    {
      title: '????????????',
      dataIndex: 'useTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '???';
      },
    },
    {
      title: '????????????',
      dataIndex: 'checkMode',
      width: 158,
      render(text, creds) {
        return checkModeEnum[text] || '???';
      },
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

  const onSearch = () => {
    const values = form.getFieldsValue();
    setQuery({
      ...query,
      ...values,
      skipCount: '1',
    });
  };

  return (
    <>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'></Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
            <Button size='small' type='primary' onClick={openFile}>
              ????????????
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}
        initialValues={query}>
        <Form.Item name='StaffType' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='????????????' allowClear>
            {staffTypeOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='date'>
          <RangePicker size='small' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='small'>
            ????????????
          </Button>
        </Form.Item>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            size='small'
            placeholder='?????????????????????'
            onSearch={onSearch}
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
    </>
  );
}
