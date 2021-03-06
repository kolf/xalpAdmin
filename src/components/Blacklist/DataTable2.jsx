import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Pagination,
} from 'antd';
import UpdateDataForm from './UpdateData2Form';
import ExportDataTable from './ExportData2Table';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';

import blanklistService from '../../services/blanklist.service';
import dataService from '../../services/data.service';
import { behaviorTypeEnum } from '../../shared/options';
const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';
const secFormat = 'YYYY-MM-DD HH:mm:ss';

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalArr, setTotalArr] = useState([0, 0]);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
  });

  useEffect(() => {
    let mounted = true;
    loadData();

    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } =
          await blanklistService.getBlockBehaviorList(makeQuery(query));
        const { totalBlockingCount, totalCount: AllTotalCount } =
          await blanklistService.getBlockAllowUserList();
        if (mounted) {
          setLoading(false);
          setDataList(items);
          setTotalArr([AllTotalCount, totalBlockingCount]);
          setTotal(totalCount);
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
  }, [JSON.stringify(query), counter]);

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === 'date' && value) {
        const [start, end] = value;
        result.StartCreationTime = start.format(dateFormat) + ' 00:00:00';
        result.EndCreationTime = end.format(dateFormat) + ' 23:59:59';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showAddModal() {
    const mod = modal({
      title: '新增',
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      title: '编辑',
      content: <UpdateDataForm onOk={onOk} defaultValues={creds} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function showImportModal(creds) {
    const mod = modal({
      title: '批量导入',
      width: 800,
      content: <ExportDataTable onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `确认删除此条内容, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await blanklistService.deleteBlockBehavior({
          id: creds.id,
        });
        mod.close();
        utils.success(`删除成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        mod.close();
      }
    }
  }

  async function openFile() {
    try {
      const res = await dataService.exportBlockBehavior(makeQuery(query));
      window.open(res);
    } catch (error) {}
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
    },
    {
      title: '行为',
      dataIndex: 'name',
      width: 160,
    },
    {
      title: '程度(惩罚措施)',
      dataIndex: 'behaviorType',
      width: 200,
      render(text) {
        return behaviorTypeEnum[text] || '无';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      width: 180,
      render(text) {
        return text ? moment(text).format(secFormat) : '无';
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      fixed: 'right',
      width: 120,
      render(text, creds) {
        return (
          <div className='text-center'>
            <Button
              size='small'
              style={{ marginRight: 4 }}
              onClick={(e) => showEditModal(creds)}>
              编辑
            </Button>
            <Button size='small' onClick={(e) => showDeleteModal(creds)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  const onSearch = () => {
    const values = form.getFieldsValue();
    setQuery({
      ...query,
      ...values,
      skipCount: '1',
    });
  };

  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total,
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
        <Col flex='auto'>
          <Space>
            <span>黑名单人数:</span>
            <span className='iconfont1 text-danger'>{totalArr[0]}</span>
            <span>当前限制人数:</span>
            <span className='iconfont1 text-danger'>{totalArr[1]}</span>
          </Space>
        </Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
            <Button size='small' type='primary' onClick={showAddModal}>
              新增
            </Button>
            <Button size='small' type='primary' onClick={showImportModal}>
              批量导入
            </Button>
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
        onFinish={onSearch}>
        <Form.Item name='date'>
          <RangePicker size='small' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='small'>
            查询数据
          </Button>
        </Form.Item>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            size='small'
            placeholder='请输入行为查询'
            onSearch={onSearch}
          />
        </Form.Item>
      </Form>

      <Table
        rowKey='id'
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
