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
      title: '工号',
      dataIndex: 'jobNumber',
    },
    {
      title: '姓名',
      dataIndex: 'staffName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '证件号码',
      dataIndex: 'certNumber',
    },
    {
      title: '人员类型',
      dataIndex: 'staffType',
      render(text) {
        return staffTypeEnum[text] || '未知';
      },
    },
    {
      title: '入园时间',
      dataIndex: 'useTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '无';
      },
    },
    {
      title: '入园方式',
      dataIndex: 'checkMode',
      width: 158,
      render(text, creds) {
        return checkModeEnum[text] || '无';
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

  return (
    <div>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'></Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
            <Button size='small' type='primary' onClick={openFile}>
              下载数据
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: '1' })}
        initialValues={query}>
        <Form.Item name='StaffType' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='人员类型' allowClear>
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
            查询数据
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            size='small'
            placeholder='请输入姓名查询'
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, keyword: value, skipCount: '1' })
            }
          />
        </Form.Item>
      </Form>

      <Table
        dataSource={makeData(data.items)}
        columns={columns}
<<<<<<< HEAD
        pagination={paginationProps}
=======
        pagination={false}
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
        size='small'
        bordered
        loading={loading}
        rowKey='id'
      />
<<<<<<< HEAD
=======
      <div className='page-container'>
        <Pagination {...paginationProps} />
      </div>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
    </div>
  );
}
