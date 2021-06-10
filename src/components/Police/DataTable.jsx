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
import LogDataTable from "./LogDataTable";
import UpdateDataForm from "./UpdateDataForm";
import policeService from "../../services/police.service";
import modal from "../../shared/modal";

import {
  deviceOptions,
  checkDeviceTypeEnum,
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
        const { items, totalCount } = await policeService.getDeviceList(
          makeQuery(query)
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
      return { ...item, ...item.device, device: undefined, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (key === "isOnline") {
        result[key] = value === "1";
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
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: "1",
      });
    }
  }

  function showAddModal() {
    const mod = modal({
      title: "新增",
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: "1",
      });
    }
  }

  function showLogModal(creds) {
    const mod = modal({
      title: "系统日志",
      width: 720,
      content: <LogDataTable id={creds.id} />,
      footer: null,
      onOk,
    });

    function onOk() {}
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
      title: "设备类型",
      dataIndex: "checkDeviceType",
      render(text) {
        return checkDeviceTypeEnum[text] || "未知";
      },
    },
    {
      title: "录入人姓名",
      dataIndex: "creatorName",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "录入人工号",
      dataIndex: "creatorJobNumber",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "录入人员电话",
      dataIndex: "creatorPhone",
      render(text) {
        return text || "无";
      },
    },

    {
      title: "在线状态",
      dataIndex: "isOnline",
      render(text) {
        return text ? "在线" : "离线";
      },
    },
    {
      title: "出入口状态",
      dataIndex: "isDirectionEnter",
      render(text) {
        return text ? "入口" : "出口";
      },
    },
    {
      title: "设备状态",
      dataIndex: "isActive",
      render(text) {
        return text ? "启用" : "停用";
      },
    },
    {
      title: "操作",
      dataIndex: "options",
      width: 180,
      fixed: "right",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => showLogModal(creds)}
            >
              查看系统日志
            </Button>
            <Button size="small" onClick={(e) => showEditModal(creds)}>
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
            <Button size="small" type="primary" onClick={showAddModal}>
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
        scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
