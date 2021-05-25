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
import facilityService from "../../services/faciliy.service";
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
      const { items, totalCount } = await facilityService.getOrderDetailList(
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
      return {
        ...item,
        ...item.orderDetail,
        orderDetail: undefined,
        index: index + 1,
      };
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
      dataIndex: "orderNO",
    },
    {
      title: "预约人",
      dataIndex: "name",
      width: 64,
    },
    {
      title: "预约人电话",
      dataIndex: "phone",
    },
    {
      title: "是否代预约",
      dataIndex: "user",
      width: 88,
    },
    {
      title: "参观人",
      dataIndex: "num",
      width: 64,
    },
    {
      title: "参观人电话",
      dataIndex: "phone",
    },
    {
      title: "身份证",
      dataIndex: "certNumber",
    },
    {
      title: "预约时段",
      dataIndex: "online",
    },
    {
      title: "参与活动",
      dataIndex: "online",
      width: 80,
    },
    {
      title: "抵达方式",
      dataIndex: "online",
      width: 80,
    },
    {
      title: "随行宠物",
      dataIndex: "online",
      width: 80,
    },
    {
      title: "人像录入",
      dataIndex: "online",
      width: 80,
    },
    {
      title: "核销设备（核销方式）",
      dataIndex: "online",
      width: 158,
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
        scroll={{ x: 1600 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
