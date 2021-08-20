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
import UpdateDataForm from './UpdateDataForm3';
import policeService from '../../services/police.service';
import sessionService from '../../services/session.service';
import modal from '../../shared/modal';

import { deviceStatusOptions, cameraStatusEnum } from '../../shared/options';
const { Option } = Select;
const { Search } = Input;

const initialData = {
  total: 0,
  records: [],
};

export default function DataTable() {
  const roles = sessionService.getUserRoles();
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    current: '1',
    size: '10',
    status: '-1',
    cameraName: '0',
  });
  const { data = initialData, loading } = useRequest(
    () =>
      policeService.getCameraList(
        {
          current: query.current,
          size: query.size,
        },
        {
          status: query.status || '-1',
          cameraName: query.cameraName,
        },
      ),
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
      return { ...item, index: index + 1 };
    });
  }

  function showEditModal(creds) {
    const mod = modal({
      title: '编辑',
      content: <UpdateDataForm onOk={onOk} defaultValues={creds} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setQuery({
        ...query,
        current: '1',
      });
    }
  }

  function showAddModal() {
    const mod = modal({
      title: '新增',
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setQuery({
        ...query,
        current: '1',
      });
    }
  }

  const columns = [
    {
      title: '设备IP',
      dataIndex: 'ip',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '管理人姓名',
      dataIndex: 'adminName',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '管理人员电话',
      dataIndex: 'adminPhone',
      width: 116,
      render(text) {
        return text || '无';
      },
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      width: 80,
      render(text) {
        return cameraStatusEnum[text] || '未知';
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: 90,
      fixed: 'right',
      render(text, creds) {
        return (
          <div className='text-center'>
            {/SmartTicketing.Devices.Update/.test(roles) && (
              <Button
                size='small'
                onClick={(e) => showEditModal(creds)}
                disabled={!creds.id}>
                编辑
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: query.current * 1,
    pageSize: query.size * 1,
    total: data.total,
    position: ['', 'bottomCenter'],
    size: 'small',
    onChange(pageNum) {
      setQuery({
        ...query,
        current: pageNum,
      });
    },
  };

  return (
    <>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'></Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
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
        onFinish={(values) => setQuery({ ...query, ...values, current: '1' })}>
        <Form.Item name='status' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='设备状态' allowClear>
            {deviceStatusOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
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
            onSearch={(value) =>
              setQuery({ ...query, current: '1', cameraName: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        rowKey='deviceId'
        dataSource={makeData(data.records || [])}
        columns={columns}
        pagination={false}
        size='small'
        bordered
        loading={loading}
      />
      <div className='page-container'>
        <Pagination {...paginationProps} />
      </div>
    </>
  );
}
