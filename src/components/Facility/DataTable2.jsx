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
  Avatar,
} from "antd";
import DataTableDetailas from "./DataTable2Detailas";
import moment from "moment";
import modal from "../../shared/modal";
import { activityOptions, checkModeEnum } from "../../shared/options";
import facilityService from "../../services/faciliy.service";
import dataService from "../../services/data.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const reviewOptions = [
  { value: "3", label: "已核销" },
  { value: "1", label: "未核销" },
];
export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalData, setTotalData] = useState({
    travelTouristCount: 0,
    usedTicketCount: 0,
  });
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    loadData();
  }, [JSON.stringify(query), counter]);

  async function loadData() {
    setLoading(true);
    try {
      const { items, totalCount } = await facilityService.getOrderList(
        makeQuery(query)
      );
      const res = await dataService.getOrderStatistics({
        ClientType: 2,
        StartTravelTime: moment().format(dateFormat) + " 00:00:00",
        EndTravelTime: moment().format(dateFormat) + " 23:59:59",
      });
      setLoading(false);
      setDataList(items);
      setTotalData(res);
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
        ...item.order,
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
      } else if (key === "isActivityApply" && value) {
        result.isActivityApplySuccess = value === "1";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showDetailsModal(creds, type) {
    let title = "查看";
    if (type === "REVIEW") {
      title = "核销";
    } else if (type === "CANCEL") {
      title = "取消";
    }
    const mod = modal({
      title,
      width: 720,
      content: (
        <DataTableDetailas onOk={onOk} showType={type} dataSource={creds} />
      ),
      footer: null,
    });
    function onOk() {}
  }

  function openFile() {}

  function getRowClassName(creds, index) {
    if (creds.orderStatus !== 1) {
      return "ant-table-row-disabled";
    }
  }

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNO",
      width: 160,
    },
    {
      title: "预约人员姓名",
      dataIndex: "name",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      // width: 116,
    },
    {
      title: "预约时间段",
      dataIndex: "timeRangeName",
      width: 196,
      render(text, creds) {
        return moment(creds.travelDate).format(dateFormat) + " " + text;
      },
    },
    {
      title: "抵达方式",
      dataIndex: "regionProvince",
      width: 80,
      render(text) {
        return text || "无";
      },
    },
    {
      title: "核销设备(核销方式)",
      dataIndex: "checkMode",
      width: 158,
      render(text) {
        return checkModeEnum[text] || "无";
      },
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 176,
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => showDetailsModal(creds, "VIEW")}
            >
              查看
            </Button>
            <Button
              size="small"
              style={{ marginRight: 4 }}
              disabled={creds.orderStatus !== 1}
              onClick={(e) => showDetailsModal(creds, "REVIEW")}
            >
              核销
            </Button>
            <Button
              size="small"
              disabled={creds.orderStatus !== 1}
              onClick={(e) => showDetailsModal(creds, "CANCEL")}
            >
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
        <Col flex="auto">
          <Space>
            <span>今日预约人数:</span>
            <span className="iconfont1 text-danger">
              {totalData.travelTouristCount}
            </span>
            <span>已核销人数:</span>
            <span className="iconfont1 text-danger">
              {totalData.usedTicketCount}
            </span>
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
        onFinish={(values) => {
          setQuery({
            ...query,
            ...values,
            skipCount: "1",
          });
        }}
      >
        <Form.Item name="Status" style={{ marginBottom: 6, width: 100 }}>
          <Select size="small" placeholder="核销状态" allowClear>
            {reviewOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="isActivityApply"
          style={{ marginBottom: 6, width: 80 }}
        >
          <Select size="small" placeholder="活动" allowClear>
            {activityOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
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
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", Keyword: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        dataSource={makeData(dataList)}
        columns={columns}
        rowClassName={getRowClassName}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        rowKey="id"
        scroll={{ x: 1100 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
