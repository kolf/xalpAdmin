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
  Avatar,
} from 'antd';
import moment from 'moment';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import UpdateDataForm from './UpdateData3Form';
import faciliyService from '../../services/faciliy.service';
import dataService from '../../services/data.service';
import { userStatusOptions } from '../../shared/options';
const { RangePicker } = DatePicker;
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
        const { items, totalCount } = await faciliyService.getStaffList(
          makeQuery(query),
        );
        if (mounted) {
          setLoading(false);
          setDataList(items);
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
      return {
        ...item.staff,
        ...item,
        tempFaceFileName: item.faceRelativePath,
        index: index + 1,
        staff: undefined,
      };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
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
      },
      {
        StaffType: 1,
      },
    );
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `???????????????????????????, ?????????????`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await faciliyService.deleteStaff(creds);
        mod.close();
        utils.success(`???????????????`);
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

  function showEditModal(creds) {
    const mod = modal({
      title: '??????',
      content: <UpdateDataForm defaultValues={creds} onOk={onOk} />,
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

  function showAddModal() {
    const mod = modal({
      title: '??????',
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

  async function openFile() {
    try {
      const res = await dataService.exportStaffList(makeQuery(query));
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
      dataIndex: 'name',
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
      dataIndex: 'departmentName',
      render(text) {
        return text || '???';
      },
    },
    {
      title: '??????',
      dataIndex: 'organizationUnit',
    },
    {
      title: '??????',
      dataIndex: 'webUrl',
      width: 76,
      render(text) {
        return text ? <Image src={text} width={60} /> : '???';
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'permissionDate',
      render(text, creds) {
        return (
          moment(creds.startCardTime).format(dateFormat) +
          '???' +
          moment(creds.endCardTime).format(dateFormat)
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'dayToPermissionEnd',
      width: 74,
      render(text) {
        return Math.max(text, 0);
      },
    },
    {
      title: '????????????',
      dataIndex: 'lastModificationTime',
      render(text) {
        return text ? moment(text).format(secFormat) : '???';
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
              onClick={(e) => showEditModal(creds)}>
              ??????
            </Button>
            <Button size='small' onClick={(e) => showDeleteModal(creds)}>
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
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'></Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
            <Button size='small' type='primary' onClick={showAddModal}>
              ??????
            </Button>
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
        onFinish={onSearch}>
        <Form.Item name='CardStatus' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='??????' allowClear>
            {userStatusOptions.map((o) => (
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
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
        rowKey='id'
        scroll={{ x: 1280 }}
      />
    </div>
  );
}
