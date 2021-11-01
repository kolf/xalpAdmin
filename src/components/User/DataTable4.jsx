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
  message,
} from 'antd';
import { useRequest } from 'ahooks';
import UpdateDataForm from './UpdateData4Form';
import moment from 'moment';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import userService from '../../services/user.service';
import sessionService from '../../services/session.service';
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
  const roles = sessionService.getUserRoles();
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
  });

  const {
    data = initialData,
    loading,
    refresh,
  } = useRequest(() => userService.getOrgList(makeQuery(query)), {
    refreshDeps: [query],
    throwOnError: true,
  });

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
        result.startDate = start.format(dateFormat) + ' 00:00:00';
        result.endDate = end.format(dateFormat) + ' 23:59:59';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将删除此部门, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await userService.deleteOrg({ id: creds.id });
        mod.close();
        refresh();
        utils.success(`删除成功！`);
      } catch (error) {
        mod.close();
      }
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      title: '编辑',
      content: <UpdateDataForm defaultValues={creds} onOk={onOk} />,
      footer: null,
    });
    function onOk() {
      mod.close();
      refresh();
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
      refresh();
    }
  }

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'displayName',
    },
    {
      title: '上级部门',
      dataIndex: 'parentName',
      render(text) {
        return text || '无';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
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
            {/AbpIdentity.Organizations.Update/.test(roles) && (
              <Button
                size='small'
                style={{ marginRight: 4 }}
                onClick={(e) => showEditModal(creds)}>
                编辑
              </Button>
            )}
            {/AbpIdentity.Organizations.Delete/.test(roles) && (
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
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search size='small' placeholder='请输入部门名称查询' allowClear />
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
        // scroll={{ x: 1200 }}
      />
    </div>
  );
}
