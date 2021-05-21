import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Row, Col, Space } from "antd";
import UpdateDataForm from "./UpdateDataForm";
import ExportDataTable from "./ExportDataTable";
import modal from "../../shared/modal";
import blanklistService from "../../services/blanklist.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
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

  function showAddModal() {
    const mod = modal({
      title: "新增",
      content: (
        <div>
          <Space>
            <Button size="small" type="primary">
              新增
            </Button>
            <Button size="small" type="primary">
              批量导入
            </Button>
            <Button size="small" type="primary">
              下载数据
            </Button>
          </Space>
          <UpdateDataForm />
        </div>
      ),
      onOk,
    });

    function onOk(values) {}
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm />,
      onOk,
    });

    function onOk(values) {}
  }

  function showExportModal(creds) {
    const mod = modal({
      title: "批量导入",
      content: <ExportDataTable />,
      onOk,
    });

    function onOk(values) {}
  }

  function showDeleteModal(creds) {
    const mod = modal.confirm({ content: `确认移除此条内容`, onOk });
    function onOk(done) {
      // mod.close()
    }
  }

  function openFile() {}

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
    },
    {
      title: "真是姓名",
      dataIndex: "name",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "身份证",
      dataIndex: "user",
    },
    {
      title: "历史不文明行为",
      dataIndex: "num",
    },
    {
      title: "不文明行为",
      dataIndex: "phone",
    },
    {
      title: "操作",
      dataIndex: "options",
      render() {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showEditModal}
            >
              编辑
            </Button>
            <Button size="small" onClick={showDeleteModal}>
              移除
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
          今日预约人数<span style={{ marginRight: 12 }}>1223</span>今日核销人数
          <span>1223</span>
        </Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={showAddModal}>
              新增
            </Button>
            <Button size="small" type="primary" onClick={showExportModal}>
              批量导入
            </Button>
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
      />
    </div>
  );
}
