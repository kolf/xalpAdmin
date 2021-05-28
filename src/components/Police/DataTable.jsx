import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Select,Pagination } from "antd";
import LogDataTable from "./LogDataTable";
import UpdateDataForm from "./UpdateDataForm";
import policeService from "../../services/police.service";
import modal from "../../shared/modal";

import {
  areaOptions,
  yearOptions,
  deviceOptions,
  mouthOptions,
  onlineOptions,
} from "../../shared/options";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    loadData({});
  }, []);

  async function loadData(newQuery) {
    const nextQuery = { ...query, ...newQuery };
    setQuery(nextQuery);
    setLoading(true);
    try {
      const { items, totalCount } = await policeService.getDeviceList(
        makeQuery(nextQuery)
      );
      setLoading(false);
      setDataList(items);
      setTotal(totalCount);
    } catch (error) {
      setLoading(false);
    }
  }

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item.device, index: index + 1 };
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

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm onOk={onOk} defaultValues={creds} />,
      footer: null,
    });

    function onOk() {
       mod.close();
      loadData({
        skipCount: "1",
      });
    }
  }

  function showLogModal(creds) {
    const mod = modal({
      title: "操作日志",
      width:720,
      content: <LogDataTable id={creds.id}/>,
      footer: null,
      onOk,
    });

    function onOk() {}
  }

  const columns = [
    {
      title: "设备IP",
      dataIndex: "ipAddress",
    },
    {
      title: "设备名称",
      dataIndex: "name",
    },
    {
      title: "设备类型",
      dataIndex: "checkDeviceType",
    },
    {
      title: "录入人姓名",
      dataIndex: "creatorName",
    },
    {
      title: "录入人工号",
      dataIndex: "creatorJobNumber",
    },
    {
      title: "录入人员电话",
      dataIndex: "creatorPhone",
    },
    {
      title: "在线状态",
      dataIndex: "isOnline",
      render(text) {
        return text ? "在线" : "离线";
      },
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

      loadData({
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
        onFinish={loadData}
      >
        <Form.Item
          name="CheckDeviceType"
          style={{ marginBottom: 6, width: 100 }}
        >
          <Select size="small" placeholder="选择设备" allowClear>
            {deviceOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="isActive" style={{ marginBottom: 6, width: 100 }}>
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
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            onSearch={(value) => loadData({ Keyword: value })}
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
