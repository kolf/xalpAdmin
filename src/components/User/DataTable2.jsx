import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Pagination,
  Space,
  Row,
  Col,
} from 'antd';
import { useRequest } from 'ahooks';
import UpdateDataForm from './UpdateData2Form';
import moment from 'moment';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import sessionService from '../../services/session.service';
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';
const secFormat = 'YYYY-MM-DD HH:mm:ss';

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
    () => userService.getRoleList(makeQuery(query)),
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
      width: 780,
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

  function showAddModal() {
    const mod = modal({
      title: '新增',
      width: 780,
      content: <UpdateDataForm onOk={onOk} />,
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

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `确认删除此条内容, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await userService.deleteRole({
          id: creds.id,
        });
        mod.close();
        utils.success(`删除成功！`);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        mod.close();
      }
    }
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '最后编辑时间',
      dataIndex: 'lastModificationTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '无';
      },
    },
    {
      title: '权限详情',
      dataIndex: 'permissions',
      render(text) {
        const str = (text || []).join(',');
        return str || '无';
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
            {/AbpIdentity.Roles.Update/.test(roles) && (
              <Button
                size='small'
                style={{ marginRight: 4 }}
                onClick={(e) => showEditModal(creds)}>
                编辑
              </Button>
            )}
            {/AbpIdentity.Roles.Delete/.test(roles) && (
              <Button size='small' onClick={(e) => showDeleteModal(creds)}>
                删除
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
      {/AbpIdentity.Roles.Create/.test(roles) && (
        <Row style={{ paddingBottom: 12 }}>
          <Col flex='auto'></Col>
          <Col flex='120px' style={{ textAlign: 'right' }}>
            <Space>
              <Button size='small' type='primary' onClick={showAddModal}>
                新增
              </Button>
            </Space>
          </Col>
        </Row>
      )}
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search
            htmlType='submit'
            size='small'
            placeholder='请输入角色名称查询'
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
      />
    </div>
  );
}
