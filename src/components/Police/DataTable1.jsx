import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Space,
  Form,
  Input,
  Select,
  Pagination,
} from 'antd';
import { useRequest } from 'ahooks';
import LogDataTable from './LogDataTable';
import UpdateDataForm from './UpdateDataForm';
import UpdateFreeCertCheckDataForm from './UpdateFreeCertCheckDataForm';
import policeService from '../../services/police.service';
import sessionService from '../../services/session.service';
import modal from '../../shared/modal';

import { onlineOptions } from '../../shared/options';
const { Option } = Select;
const { Search } = Input;

const initialData = {
  totalCount: 0,
  items: [],
};

export default function DataTable() {
  const roles = sessionService.getUserRoles();
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
  });
  const { data = initialData, loading } = useRequest(
    () => policeService.getDeviceList(makeQuery(query)),
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
      return { ...item, ...item.device, device: undefined, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (value !== undefined && value !== '-1') {
          result[key] = value;
        }
        if (key === 'isOnline' && value !== undefined) {
          result[key] = value === '1';
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        CheckDeviceType: 1,
      },
    );
  }

  function showEditModal(creds) {
    const mod = modal({
      title: '编辑',
      content: (
        <UpdateDataForm onOk={onOk} defaultValues={creds} checkDeviceType='1' />
      ),
      footer: null,
    });

    function onOk() {
      mod.close();
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function setIsEnableFreeCertCheck() {
    const mod = modal({
      title: `全开无预约入园`,
      content: <UpdateFreeCertCheckDataForm onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function showAddModal() {
    const mod = modal({
      title: '新增',
      content: <UpdateDataForm onOk={onOk} checkDeviceType='1' />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setQuery({
        ...query,
        skipCount: '1',
      });
    }
  }

  function showLogModal(creds) {
    const mod = modal({
      title: '系统日志',
      width: 720,
      content: <LogDataTable id={creds.id} />,
      footer: null,
      onOk,
    });

    function onOk() {}
  }
  const columns = [
    {
      title: '设备IP',
      dataIndex: 'ipAddress',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备编码',
      dataIndex: 'code',
    },
    {
      title: '录入人姓名',
      dataIndex: 'creatorName',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '录入人工号',
      dataIndex: 'creatorJobNumber',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '录入人员电话',
      dataIndex: 'creatorPhone',
      width: 116,
      render(text) {
        return text || '无';
      },
    },
    {
      title: '无预约入园',
      dataIndex: 'isEnableFreeCertCheck',
      width: 90,
      render(text) {
        return text ? '是' : '否';
      },
    },
    {
      title: '在线状态',
      dataIndex: 'isOnline',
      width: 80,
      render(text) {
        return text ? '在线' : '离线';
      },
    },
    {
      title: '出入口状态',
      width: 90,
      dataIndex: 'isDirectionEnter',
      render(text) {
        return text ? '入口' : '出口';
      },
    },
    {
      title: '设备状态',
      dataIndex: 'isActive',
      width: 80,
      render(text) {
        return text ? '启用' : '停用';
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: 180,
      fixed: 'right',
      render(text, creds) {
        return (
          <div className='text-center'>
            <Button
              size='small'
              style={{ marginRight: 4 }}
              onClick={(e) => showLogModal(creds)}>
              查看系统日志
            </Button>
            {/SmartTicketing.Devices.Update/.test(roles) && (
              <Button size='small' onClick={(e) => showEditModal(creds)}>
                编辑
              </Button>
            )}
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
            <Button
              size='small'
              type='primary'
              onClick={setIsEnableFreeCertCheck}>
              全开无预约入园
            </Button>
            {/SmartTicketing.Devices.Create/.test(roles) && (
              <Button size='small' type='primary' onClick={showAddModal}>
                新增
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item name='isOnline' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='设备状态' allowClear>
            {onlineOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
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
            placeholder='请输入设备名称查询'
            onSearch={onSearch}
          />
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
        scroll={{ x: 1280 }}
      />
    </div>
  );
}
