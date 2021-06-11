import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Button, Form, Input, Pagination, Select } from "antd";
import UpdateDataForm from "./UpdateData2Form";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";

import activityService from "../../services/activity.service";
import { activityOrderStatusOptions } from "../../shared/options";
const { Search } = Input;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const secFormat = "YYYY-MM-DD HH:mm:ss";

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    keyword: "",
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
          setDataList(items);
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
      if (value !== undefined && value !== "-1") {
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
      result[key] = value;
      return result;
    }, {});
  }

  function showEditModal(creds) {
    let modRef = null;
    const mod = modal({
      title: "审核订单",
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
          makeParams(values)
        );
        utils.success(`审核活动订单成功！`);
        console.log(res, "res");
        mod.close();
        setCounter(counter + 1);
        setQuery({
          ...query,
          skipCount: "1",
        });
      } catch (error) {
        utils.error(`审核活动订单失败！`);
      }
    }
  }

  function showDetailsModal(creds) {
    const mod = modal({
      title: "查看订单",
      width: 720,
      content: <UpdateDataForm defaultValues={creds} />,
    });
  }

  const columns = [
    {
      title: "订单号",
      dataIndex: "index",
    },
    {
      title: "活动名称",
      dataIndex: "activityName",
    },
    {
      title: "订单状态",
      dataIndex: "orderStatus",
    },
    {
      title: "下单时间",
      dataIndex: "applyTime",
      render(text) {
        return text ? moment(text).format(secFormat) : "无";
      },
    },
    {
      title: "团队负责人",
      dataIndex: "name",
    },
    {
      title: "报名状态",
      dataIndex: "auditStatus",
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => showDetailsModal(creds)}
            >
              查看
            </Button>
            <Button size="small" onClick={(e) => showEditModal(creds)}>
              审核
            </Button>
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
    total,
    position: ["", "bottomCenter"],
    size: "small",
    onChange(pageNum, pageSize) {
      let nextPageNum = pageNum;
      if (pageSize != query.maxResultCount * 1) {
        nextPageNum = 1;
      }
      setQuery({
        ...query,
        skipCount: nextPageNum + "",
        maxResultCount: pageSize + "",
      });
    },
  };

  return (
    <div>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
      >
        <Form.Item name="Status" style={{ marginBottom: 6, width: 100 }}>
          <Select size="small" placeholder="订单状态" allowClear>
            {activityOrderStatusOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}