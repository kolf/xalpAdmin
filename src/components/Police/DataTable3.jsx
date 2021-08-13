import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Space,
  Form,
  Input,
  Select,
  Pagination,
} from "antd";
import { useRequest } from "ahooks";
import LogDataTable from "./LogDataTable";
import UpdateDataForm from "./UpdateDataForm";
import policeService from "../../services/police.service";
import modal from "../../shared/modal";

import { onlineOptions } from "../../shared/options";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";

export default function DataTable() {
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    keyword: "",
  });

  const { data, run, loading, refresh } = useRequest(
    () => policeService.getDeviceList(makeQuery(query)),
    {
      initialData: {
        items: [],
        totalCount: 0,
      },
      refreshDeps: [query],
    }
  );
  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item, ...item.device, device: undefined, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (key === "isOnline" && value !== undefined) {
          result[key] = value === "1";
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        CheckDeviceType: 1,
      }
    );
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: (
        <UpdateDataForm onOk={onOk} defaultValues={creds} checkDeviceType="2" />
      ),
      footer: null,
    });

    function onOk() {
      mod.close();
      refresh();
      // setQuery({
      //   ...query,
      //   skipCount: "1",
      // });
    }
  }

  function showAddModal() {
    const mod = modal({
      title: "新增",
      content: <UpdateDataForm onOk={onOk} checkDeviceType="2" />,
      footer: null,
    });

    function onOk() {
      mod.close();
      refresh();
      // setCounter(counter + 1);
      // setQuery({
      //   ...query,
      //   skipCount: "1",
      // });
    }
  }

  const columns = [
    {
      title: "设备IP",
      dataIndex: "ipAddress",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "设备名称",
      dataIndex: "name",
    },
    {
      title: "设备编码",
      dataIndex: "code",
    },
    {
      title: "管理人姓名",
      dataIndex: "handlerName",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "管理人员电话",
      dataIndex: "handlerPhone",
      width: 116,
      render(text) {
        return text || "无";
      },
    },
    {
      title: "在线状态",
      dataIndex: "isOnline",
      width: 80,
      render(text) {
        return text ? "在线" : "离线";
      },
    },
    {
      title: "操作",
      dataIndex: "options",
      width: 90,
      fixed: "right",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button disabled size="small" onClick={(e) => showEditModal(creds)}>
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
    total: data.totalCount,
    position: ["", "bottomCenter"],
    size: "small",
    onChange(pageNum, pageSize) {
      let nextPageNum = pageNum;
      if (pageSize !== query.maxResultCount * 1) {
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
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto"></Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={showAddModal} disabled>
              新增
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
      >
        <Form.Item name="isOnline" style={{ marginBottom: 6, width: 100 }}>
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
            placeholder="请输入设备名称查询"
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        dataSource={makeData(data.items)}
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