import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Pagination } from 'antd';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import moment from 'moment';
import facilityService from '../../services/faciliy.service';
const { Search } = Input;
const secFormat = 'YYYY-MM-DD HH:mm:ss';

export default function DataTable({ dataSource, showType }) {
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
        const { items, totalCount } = await facilityService.getOrderDetailList(
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
        ...item.orderDetail,
        ...item,
        orderDetail: undefined,
        index: index + 1,
      };
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
        OrderId: dataSource.id,
      },
    );
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `????????????????????????, ?????????????`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.cancelOrder({ id: creds.id });
        mod.close();
        utils.success(`???????????????`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        mod.close();
      }
      // mod.close()
    }
  }

  function showReviewModal(creds) {
    const mod = confirm({
      content: `????????????????????????, ?????????????`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.checkOrder({ id: creds.id });
        mod.close();
        utils.success(`???????????????`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        mod.close();
      }
    }
  }

  function getRowClassName(creds, index) {
    if (creds.status !== 1) {
      return 'ant-table-row-disabled';
    }
  }

  function makeColumns() {
    let columns = [
      {
        title: '??????',
        dataIndex: 'index',
        width: 60,
        render(text) {
          return text || '???';
        },
      },
      {
        title: '???????????????',
        dataIndex: 'name',
        render(text) {
          return text || '??????';
        },
      },
      {
        title: '??????',
        dataIndex: 'phone',
        render(text) {
          return text || '??????';
        },
      },
      {
        title: '????????????',
        dataIndex: 'certNumber',
        render(text) {
          return text || '??????';
        },
      },
      {
        title: '?????????',
        dataIndex: 'regionProvinceName',
        render(text) {
          return text || '???';
        },
      },
      {
        title: '????????????ID',
        dataIndex: 'checkDeviceCode',
        render(text) {
          return text || '???';
        },
      },
      {
        title: '??????????????????????????????',
        dataIndex: 'checkModeName',
        width: 158,
        render(text, creds) {
          return creds.checkDeviceName
            ? `${creds.checkDeviceName}(${text})`
            : '???';
        },
      },
      {
        title: '??????/????????????',
        dataIndex: 'checkTime',
        width: 168,
        render(text, creds) {
          const title = creds.cancelTime || creds.checkTime;

          return title ? moment(title).format(secFormat) : '???';
        },
      },
      {
        title: '????????????',
        dataIndex: 'cancelUserName',
        width: 120,
        render(text, creds) {
          console.log(creds, 'creds');
          let title = '';
          if (text) {
            title = `????????????/${text}`;
          } else if (creds.checkUserName) {
            title = `????????????/${creds.checkUserName}`;
          }
          return title || '???';
        },
      },
    ];
    if (/(REVIEW|CANCEL)/.test(showType)) {
      columns.push({
        title: '??????',
        dataIndex: 'options',
        fixed: 'right',
        width: 90,
        render(text, creds) {
          return (
            <div className='text-center'>
              {showType === 'CANCEL' ? (
                <Button
                  size='small'
                  onClick={(e) => showDeleteModal(creds)}
                  disabled={creds.status !== 1}>
                  ????????????
                </Button>
              ) : (
                <Button
                  size='small'
                  onClick={(e) => showReviewModal(creds)}
                  disabled={creds.status !== 1}>
                  ??????
                </Button>
              )}
            </div>
          );
        },
      });
    }
    return columns;
  }

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

  if (loading) {
    return null;
  }

  return (
    <>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item
          name='keyword'
          style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Search size='small' placeholder='????????????' onSearch={onSearch} />
        </Form.Item>
      </Form>
      <Table
        rowKey='id'
        dataSource={makeData(dataList)}
        columns={makeColumns()}
        rowClassName={getRowClassName}
        pagination={paginationProps}
        size='small'
        bordered
        loading={loading}
      />
    </>
  );
}
