import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Button, Form, Input, Pagination, Select, Tooltip } from 'antd';
import UpdateDataForm from './UpdateData2Form';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';

import activityService from '../../services/activity.service';
import {
  activityOrderReviewOptions,
  activityOrderAuditStatusEnum,
  activityOrderStatusEnum,
} from '../../shared/options';
const { Search } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const secFormat = 'YYYY-MM-DD HH:mm:ss';

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
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
          await activityService.getActivityOrderList(makeQuery(query));
        if (mounted) {
          setLoading(false);
          setDataList(
            items.map((item) => ({ ...item, ...item.activityOrder })),
          );
          setTotal(totalCount);
          // showEditModal({});
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
      return { ...item, ...item.activityOrder, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === 'isApplySuccess') {
        result[key] = value === '1';
      } else {
        result[key] = value;
      }

      return result;
    }, {});
  }

  function getRowClassName(creds, index) {
    if (creds.orderStatus !== 0) {
      return 'ant-table-row-disabled';
    }
  }

  function showEditModal(creds) {
    let modRef = null;
    const mod = modal({
      title: '????????????',
      width: 720,
      content: (
        <UpdateDataForm defaultValues={creds} saveRef={(r) => (modRef = r)} />
      ),
      onOk,
    });

    async function onOk() {
      const values = await modRef.validateFields();
      try {
        mod.confirmLoading();
        const res = await activityService.updateActivityOrderStatus(
          makeParams({ ...values, id: creds.id }),
        );
        utils.success(`???????????????????????????`);

        mod.close();
        setCounter(counter + 1);
        setQuery({
          ...query,
          skipCount: '1',
        });
      } catch (error) {
        mod.close();
      }
    }
  }

  function showDetailsModal(creds) {
    const mod = modal({
      title: '????????????',
      width: 720,
      content: <UpdateDataForm defaultValues={creds} />,
      footer: null,
    });
  }

  const columns = [
    {
      title: '?????????',
      dataIndex: 'orderNO',
    },
    {
      title: '????????????',
      dataIndex: 'activityName',
    },
    {
      title: '????????????',
      dataIndex: 'orderStatus',
      render(text) {
        return activityOrderStatusEnum[text] || '??????';
      },
    },
    {
      title: '????????????',
      dataIndex: 'applyTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '???';
      },
    },
    {
      title: '???????????????',
      dataIndex: 'name',
    },
    {
      title: '????????????',
      dataIndex: 'auditStatus',
      width: 80,
      render(text) {
        return activityOrderAuditStatusEnum[text] || '??????';
      },
    },
    {
      title: '??????',
      dataIndex: 'options',
      fixed: 'right',
      width: 120,
      render(text, creds) {
        return (
          <div className='text-center'>
            <Button
              size='small'
              style={{ marginRight: 4 }}
              onClick={(e) => showDetailsModal(creds)}>
              ??????
            </Button>
            <Button
              disabled={creds.orderStatus !== 0}
              size='small'
              onClick={(e) => showEditModal(creds)}>
              ??????
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
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item name='Status' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='????????????' allowClear>
            {activityOrderReviewOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='small'>
            ????????????
          </Button>
        </Form.Item>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Tooltip
            title='?????????????????????????????????????????????'
            color={'rgba(11, 34, 63, 0.9)'}
            overlayStyle={{ minWidth: 200, textAlign: 'center !important' }}>
            <Search
              size='small'
              placeholder='?????????????????????????????????????????????'
              onSearch={onSearch}
            />
          </Tooltip>
        </Form.Item>
      </Form>

      <Table
        rowKey='id'
        rowClassName={getRowClassName}
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
      />
    </div>
  );
}
