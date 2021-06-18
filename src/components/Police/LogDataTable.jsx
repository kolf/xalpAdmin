import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Select } from "antd";
import policeService from "../../services/police.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default function DataTable({ id }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
  });

  useEffect(() => {
    let mounted = true;
    loadData();
    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } = await policeService.getDeviceLogList(
          makeQuery(query)
        );
        if (mounted) {
          setLoading(false);
          setDataList(
            items.map((item) => ({
              ...item,
              ...item.deviceInteractionLog,
            }))
          );
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
    return data.map((item, index) => {
      return { ...item.device, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (key === "date" && value) {
          const [start, end] = value;
          result.StartTime = start.format(dateFormat) + " 00:00:00";
          result.EndTime = end.format(dateFormat) + " 23:59:59";
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        DeviceId: id,
      }
    );
  }

  const columns = [
    {
      title: "设备IP地址",
      dataIndex: "ipAddress",
    },
    {
      title: "操作时间",
      dataIndex: "interactionTime",
    },
    {
      title: "操作详情",
      dataIndex: "logContent",
    },
  ];

  const paginationProps = {
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total,
    position: ["", "bottomCenter"],
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
        <Form.Item name="date">
          <RangePicker size="small" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size="small"
        bordered
        loading={loading}
      />
    </div>
  );
}
