import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Row, Col } from "antd";
import blanklistService from "../../services/blanklist.service";
const { RangePicker } = DatePicker;
const dataFormat = "YYYY-MM-DD";
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
          <Button size="small" style={{ marginRight: 4 }}>
            编辑
          </Button>
          <Button size="small">移除</Button>
        </div>
      );
    },
  },
];

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function onFinish(values) {
    loadData(makeQuery(values));
  }

  async function loadData(query) {
    try {
      setLoading(true);
      const res = await blanklistService.getBlacklist(query);
      setLoading(false);
      setDataList(res);
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
        result.StartCreationTime = start.format(dataFormat) + " 00:00:00";
        result.EndCreationTime = end.format(dataFormat) + " 23:59:59";
      }

      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  return (
    <div>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">
          今日预约人数<span style={{ marginRight: 12 }}>1223</span>今日核销人数
          <span>1223</span>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={onFinish}
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
        dataSource={makeData(dataList)}
        columns={columns}
        size="small"
        bordered
        loading={loading}
      />
    </div>
  );
}
