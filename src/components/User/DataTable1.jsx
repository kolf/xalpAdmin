import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Row, Col, Space } from 'antd';
import { useRequest } from 'ahooks';
import UpdateDataForm from './UpdateData1Form';
import modal from '../../shared/modal';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import dataService from '../../services/data.service';
import sessionService from '../../services/session.service';
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';

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
    () => userService.getUserList(makeQuery(query)),
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

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === 'date' && value) {
        const [start, end] = value;
        result.StartTimeStart = start.format(dateFormat) + ' 00:00:00';
        result.StartTimeEnd = end.format(dateFormat) + ' 23:59:59';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
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
        skipCount: '1',
      });
    }
  }

  async function openFile() {
    try {
      const res = await dataService.exportUserList(makeQuery(query));
      window.open(res);
    } catch (error) {
      utils.error(`下载失败！`);
    }
  }

  const columns = [
    {
      title: '工号',
      dataIndex: 'jobNumber',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleNames',
      render(text) {
        return text.length > 0 ? text.join('，') : '无';
      },
    },
    {
      title: '所属部门',
      dataIndex: 'orginazationUnitName',
      render(text) {
        return text.length > 0 ? text.join('，') : '无';
      },
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'options',
      render(text, creds) {
        return (
          <div className='text-center'>
            {/AbpIdentity.Users.Update/.test(roles) && (
              <Button size='small' onClick={(e) => showEditModal(creds)}>
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
        onFinish={(values) =>
          setQuery({ ...query, ...values, skipCount: '1' })
        }>
        <Form.Item style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            size='small'
            placeholder='请输入姓名查询'
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: '1', keyword: value })
            }
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
      />
    </div>
  );
}
