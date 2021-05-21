import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Row, Col, Space,Select } from "antd";
import modal from "../../shared/modal";
import blanklistService from "../../services/blanklist.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
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
      if (key === "date" && value) {
        const [start, end] = value;
        result.StartTimeStart = start.format(dataFormat) + " 00:00:00";
        result.StartTimeEnd = end.format(dataFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function showDeleteModal(creds) {
    const mod = modal.confirm({ content: `此操作将取消该票, 是否继续?`, onOk });
    function onOk(done) {
      // mod.close()
    }
  }

  function showReviewModal(creds) {
    const mod = modal.confirm({ content: `此操作将核销该票, 是否继续?`, onOk });
    function onOk(done) {
      // mod.close()
    }
  }

  function openFile() {}

  const columns = [
    {
      title: "订单号",
      dataIndex: "name",
    },
    {
      title: "预约人员姓名",
      dataIndex: "age",
    },
    {
      title: "联系电话",
      dataIndex: "address",
    },
    {
      title: "预约时间段",
      dataIndex: "user",
    },
    {
      title: "抵达方式",
      dataIndex: "num",
    },
    {
      title: "核销设备(核销方式)",
      dataIndex: "phone",
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 120,
      render() {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showReviewModal}
            >
              核销
            </Button>
            <Button size="small" onClick={showDeleteModal}>
              取消
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
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">
          <Space>
            <span>今日预约人数:</span>
            <span className="iconfont1 text-danger">1223</span>
            <span>今日预约人数:</span>
            <span className="iconfont1 text-danger">1223</span>
          </Space>
        </Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={openFile}>
              下载数据
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={loadData}
      >
        <Form.Item name="username">
          <Select placeholder="系统菜单" size="small">
            <Option value="police">设备管理</Option>
            <Option value="facility">预约入园</Option>
            <Option value="blacklist">黑名单管理</Option>
            <Option value="user">权限管理</Option>
          </Select>
        </Form.Item>
        <Form.Item name="date">
          <RangePicker size="small" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search size="small" placeholder="模糊搜索" />
        </Form.Item>
      </Form>

      <Table
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size="small"
        bordered
        loading={loading}
        // scroll={{ x: 1200 }}
      />
    </div>
  );
}
