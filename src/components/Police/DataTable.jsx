import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Select } from "antd";
import blanklistService from "../../services/blanklist.service";
import modal from "../../shared/modal";
import LogDataTable from "./LogDataTable";
import UpdateDataForm from "./UpdateDataForm";
import {
  areaOptions,
  yearOptions,
  deviceOptions,
  mouthOptions,
  onlineOptions,
} from "../../shared/options";
const { Option } = Select;
const dataFormat = "YYYY-MM-DD";

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
  });

  useEffect(() => {
    loadData({});
  }, []);

  async function loadData(newQuery) {
    const nextQuery = { ...query, ...newQuery };
    setQuery(nextQuery);
    setLoading(true);
    try {
      const { items, totalCount } =
        await blanklistService.getBlockAllowUserList(makeQuery(nextQuery));
      setLoading(false);
      setDataList(items);
      setTotal(totalCount);
    } catch (error) {
      setLoading(false);
    }
  }

  function makeData(data) {
    return data.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function showEditModal() {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm></UpdateDataForm>,
      onOk,
    });

    function onOk() {}
  }

  function showLogModal() {
    const mod = modal({
      title: "操作日志",
      content: <LogDataTable />,
      footer: null,
      onOk,
    });

    function onOk() {}
  }

  const columns = [
    {
      title: "设备IP",
      dataIndex: "name",
    },
    {
      title: "设备名称",
      dataIndex: "age",
    },
    {
      title: "设备类型",
      dataIndex: "address",
    },
    {
      title: "录入人姓名",
      dataIndex: "user",
    },
    {
      title: "录入人工号",
      dataIndex: "num",
    },
    {
      title: "录入人员电话",
      dataIndex: "phone",
    },
    {
      title: "在线状态",
      dataIndex: "online",
    },
    {
      title: "操作",
      dataIndex: "options",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showLogModal.bind(this, creds)}
            >
              查看操作日志
            </Button>
            <Button size="small" onClick={showEditModal.bind(this, creds)}>
              编辑
            </Button>
          </div>
        );
      },
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
        onFinish={loadData}
      >
        <Form.Item name="aa" style={{ marginBottom: 6,width:100 }}>
          <Select size="small" placeholder="选择设备" allowClear>
            {deviceOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="a2" style={{ marginBottom: 6,width:100 }}>
          <Select size="small" placeholder="设备状态" allowClear>
            {onlineOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
      </Form>

      <Table
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
