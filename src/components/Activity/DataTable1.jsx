import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Pagination,
  Select,
} from 'antd';
import moment from 'moment';
import UpdateDataForm from './UpdateData1Form';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import {
  activityStatusOptions,
  activityApplyStatusOptions,
} from '../../shared/options';
import activityService from '../../services/activity.service';
import dataService from '../../services/data.service';
const { Search } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [areaOptions, setAreaOptions] = useState([]);
  const [query, setQuery] = useState({
    skipCount: '1',
    maxResultCount: '10',
    keyword: '',
  });

  useEffect(() => {
    let mounted = true;
    loadData();
    if (areaOptions.length === 0) {
      loadAreaOptions();
    }

    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } = await activityService.getActivityList(
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

    async function loadAreaOptions() {
      const res = await dataService.getAreaOptions({ level: 4 });
      const options = res.map((item) => ({
        value: item.code,
        label: item.name,
        isLeaf: false,
      }));
      if (mounted) {
        setAreaOptions(options);
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
        ...item,
        index: index + 1,
      };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === 'isActive' && value !== undefined) {
        result[key] = value === '1';
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
    let modRef = null;
    const mod = modal({
      title: '??????',
      width: 960,
      style: { top: 20 },
      bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
      content: (
        <UpdateDataForm
          areaOptions={areaOptions}
          saveRef={(r) => (modRef = r)}
        />
      ),
      onOk,
    });

    async function onOk() {
      const values = await modRef.validateFields();
      try {
        mod.confirmLoading();
        const res = await activityService.addActivity(makeParams(values));
        utils.success(`?????????????????????`);
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

  function showEditModal(creds) {
    if (!creds.isActive || creds.stateName !== '?????????') {
      let stateName = creds.stateName;
      if (!creds.isActive) {
        stateName = '?????????';
      }
      const mod = confirm({
        content: (
          <div>
            ???????????? <span style={{ color: '#ff0000' }}>{stateName}</span>
            ????????????????????????, ?????????????
          </div>
        ),
        onOk() {
          mod.close();
          show();
        },
      });
      return;
    }

    show();
    // !creds.isActive || creds.stateName !== "?????????"

    function show() {
      let modRef = null;
      const mod = modal({
        title: '??????',
        width: 960,
        style: { top: 20 },
        bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
        content: (
          <UpdateDataForm
            areaOptions={areaOptions}
            saveRef={(r) => (modRef = r)}
            defaultValues={creds}
          />
        ),
        onOk,
      });

      async function onOk() {
        const values = await modRef.validateFields();
        try {
          mod.confirmLoading();
          const res = await activityService.updateActivity({
            ...makeParams(values),
            id: creds.id,
          });
          utils.success(`?????????????????????`);

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
  }

  function showViewModal(creds) {
    const mod = modal({
      title: '??????',
      width: 960,
      style: { top: 20 },
      bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
      content: (
        <UpdateDataForm areaOptions={areaOptions} defaultValues={creds} />
      ),
      footer: null,
    });
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: (
        <div>
          ???????????? <span style={{ color: '#ff0000' }}>{creds.stateName}</span>
          ?????????????????????, ?????????????
        </div>
      ),
      onOk,
    });
    async function onOk() {
      try {
        const res = await activityService.deleteActivity({
          id: creds.id,
        });
        mod.close();
        utils.success(`???????????????`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        mod.close();
      }
    }
  }

  function showUpdateStatusModal(creds, value) {
    const mod = confirm({
      content: (
        <div>
          ????????????<span style={{ color: '#ff0000' }}>{creds.stateName}</span>
          ???????????????{value ? '??????' : '??????'}, ?????????????
        </div>
      ),
      onOk,
    });
    async function onOk() {
      try {
        const res = await activityService.updateActivityStatus({
          id: creds.id,
          changeToActive: value,
        });
        mod.close();
        utils.success(`${value ? '??????' : '??????'}?????????`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: '1' });
      } catch (error) {
        utils.error(error);
        mod.close();
      }
    }
  }

  function getRowClassName(creds, index) {
    if (!creds.isActive) {
      return 'ant-table-row-disabled';
    }
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === 'date1' && value) {
        const [start, end] = value;
        result.startDate = start.format(dateFormat);
        result.endDate = end.format(dateFormat);
      } else if (key === 'date2' && value) {
        const [start, end] = value;
        result.applyStartDate = start.format(dateFormat);
        result.applyDeadlineDate = end.format(dateFormat);
      } else if (key === 'applyUserCount' && value) {
        const [min, max] = value;
        result.minApplyUserCount = min;
        result.maxApplyUserCount = max;
      } else if (key === 'tude') {
        const [x, y] = value.split(/,|???/g);
        result.longitude = x;
        result.latitude = y;
      } else if (key === 'provinceLevel' && value) {
        const [p, c, a] = value;
        result.regionProvinceName = p.label;
        result.regionProvinceCode = p.value;
        result.regionCityName = c.label;
        result.regionCityCode = c.value;
        result.regionAreaName = a.label;
        result.regionAreaCode = a.value;
      } else if (key === 'tempPictureItems') {
        result.tempPictureItems = value.map((v) => v.response || v.url);
      } else if (/note|description/.test(key)) {
        result[key] = value;
      } else if (/isActive/.test(key)) {
        result[key] = value === '1';
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  const columns = [
    {
      title: '????????????',
      dataIndex: 'name',
    },
    {
      title: '????????????',
      dataIndex: 'address',
    },
    {
      title: '????????????',
      dataIndex: 'isActive',
      width: 100,
      render(text) {
        return text ? '?????????' : '?????????';
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'startDate',
      render(text, creds) {
        return (
          moment(creds.startDate).format(dateFormat) +
          '???' +
          moment(creds.endDate).format(dateFormat)
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'stateName',
      width: 100,
      render(text) {
        return text || '??????';
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'applyStartDate',
      render(text, creds) {
        return (
          moment(creds.applyStartDate).format(dateFormat) +
          '???' +
          moment(creds.applyDeadlineDate).format(dateFormat)
        );
      },
    },
    {
      title: '???????????????',
      dataIndex: 'lastModifyUserName',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'options',
      width: 230,
      fixed: 'right',
      render(text, creds) {
        return (
          <div className='text-center'>
            <Button
              size='small'
              style={{ marginRight: 4 }}
              onClick={(e) => showViewModal(creds)}>
              ??????
            </Button>
            <Button
              size='small'
              style={{ marginRight: 4 }}
              onClick={(e) => showEditModal(creds)}
              // disabled={!creds.isActive || creds.stateName !== "?????????"}
            >
              ??????
            </Button>
            {creds.isActive ? (
              <Button
                size='small'
                style={{ marginRight: 4 }}
                // disabled={creds.stateName === "?????????"}
                onClick={(e) => showUpdateStatusModal(creds, false)}>
                ??????
              </Button>
            ) : (
              <Button
                size='small'
                style={{ marginRight: 4 }}
                // disabled={creds.stateName !== "?????????"}
                onClick={(e) => showUpdateStatusModal(creds, true)}>
                ??????
              </Button>
            )}

            <Button
              size='small'
              // disabled={creds.stateName === "?????????"}
              onClick={(e) => showDeleteModal(creds)}>
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
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name='form'
        layout='inline'
        style={{ paddingBottom: 12 }}
        onFinish={onSearch}>
        <Form.Item name='isActive' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='????????????' allowClear>
            {activityStatusOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='stateName' style={{ marginBottom: 6, width: 100 }}>
          <Select size='small' placeholder='????????????' allowClear>
            {activityApplyStatusOptions.map((o) => (
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
          <Search
            size='small'
            placeholder='???????????????????????????'
            onSearch={onSearch}
          />
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
        scroll={{ x: 1400 }}
      />
    </div>
  );
}
