import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Select,
  Pagination,
  message,
} from "antd";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import DetailsDataTable from "./DetailsDataTable";
import blanklistService from "../../services/blanklist.service";
import { reviewOptions } from "../../shared/options";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
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
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.StartTimeStart = start.format(dateFormat) + " 00:00:00";
        result.StartTimeEnd = end.format(dateFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showDetailsModal(creds) {
    const mod = modal({
      title: "团体赛详情",
      width: 640,
      content: <DetailsDataTable></DetailsDataTable>,
      footer: null,
      onOk,
    });

    function onOk() {}
  }

  function showDeleteModal(creds) {
    const mod = confirm({ content: `此操作将取消该票, 是否继续?`, onOk });
    function onOk() {
      mod.close()
    }
  }

  function showReviewModal(creds) {
    const mod = confirm({ content: `此操作将核销该票, 是否继续?`, onOk });
    function onOk() {
      mod.close()
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
      width: 176,
      render() {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showDetailsModal}
            >
              查看
            </Button>
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
        <Form.Item name="a1" style={{ marginBottom: 6, width: 100 }}>
          <Select size="small" placeholder="核销状态" allowClear>
            {reviewOptions.map((o) => (
              <Option key={o.value}>{o.label}</Option>
            ))}
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
          <Search
            size="small"
            placeholder="模糊搜索"
            onSearch={(value) => loadData({ Keyword: value })}
          />
        </Form.Item>
      </Form>

      <Table
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        rowKey="id"
        // scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
