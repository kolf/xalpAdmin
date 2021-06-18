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
} from "antd";
import moment from "moment";
import modal from "../../shared/modal";
import {
  activityOptions,
  orderChannelEnum,
  checkModeEnum,
} from "../../shared/options";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
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
    keyword: "",
  });

  useEffect(() => {
    let mounted = true;
    loadData();
    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } = await facilityService.getOrderDetailList(
          makeQuery(query)
        );
        const res = await dataService.getOrderStatistics({
          ClientType: 1,
          StartTravelTime: moment().format(dateFormat) + " 00:00:00",
          EndTravelTime: moment().format(dateFormat) + " 23:59:59",
        });
        if (mounted) {
          setLoading(false);
          setDataList(items);
          setTotalData(res);
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
      const { orderDetail } = item;
      return {
        ...orderDetail,
        ...item,
        name1: orderDetail.name,
        phone1: orderDetail.phone,
        index: index + 1,
      };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (key === "date" && value) {
          const [start, end] = value;
          result.StartTravelTime = start.format(dateFormat) + " 00:00:00";
          result.EndTravelTime = end.format(dateFormat) + " 23:59:59";
        } else if (key === "isActivityApply" && value !== undefined) {
          result.isActivityApplySuccess = value === "1";
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        ClientType: 1,
      }
    );
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将取消该票, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.cancelOrder({ id: creds.id });
        mod.close();
        utils.success(`取消成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
      // mod.close()
    }
  }

  function showReviewModal(creds) {
    const mod = confirm({
      content: `此操作将核销该票, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.checkOrder({ id: creds.id });
        mod.close();
        utils.success(`核销成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
    }
  }

  async function openFile() {
    try {
      const res = await dataService.exportOrderList(makeQuery(query));
      window.open(res);
    } catch (error) {}
  }

  function getRowClassName(creds, index) {
    if (creds.status !== 1) {
      return "ant-table-row-disabled";
    }
  }

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNO",
      width: 156,
      render(text, creds) {
        return creds.orderNO || "无";
      },
    },
    {
      title: "预约人",
      dataIndex: "name",
      width: 64,
      render(text) {
        return text || "无";
      },
    },
    {
      title: "预约人电话",
      dataIndex: "phone",
      width: 114,
    },
    {
      title: "是否代预约",
      dataIndex: "isActivityApply",
      width: 88,
      render(text) {
        return text ? "是" : "否";
      },
    },
    {
      title: "参观人",
      dataIndex: "name1",
      width: 64,
      render(text, creds) {
        return text || "无";
      },
    },
    {
      title: "参观人电话",
      dataIndex: "phone1",
      width: 114,
      render(text, creds) {
        return text || "无";
      },
    },
    {
      title: "证件号码",
      dataIndex: "certNumber",
      width: 174,
      render(text, creds) {
        return creds.certNumber || "无";
      },
    },
    {
      title: "预约时段",
      dataIndex: "timeRangeName",
      width: 196,
      render(text, creds) {
        return moment(creds.startDate).format(dateFormat) + " " + text;
      },
    },
    {
      title: "参与活动",
      dataIndex: "activityName",
      width: 80,
      render(text) {
        return text || "无";
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
      title: "随行宠物",
      dataIndex: "petInfo",
      width: 80,
      render(text) {
        return text || "无";
      },
    },
    {
      title: "照片信息",
      dataIndex: "faceWebUrl",
      width: 76,
      render(text) {
        return text ? <img width="60" src={text} /> : "无";
      },
    },
    {
      title: "预约来源",
      dataIndex: "orderChannel",
      render(text) {
        return text ? orderChannelEnum[text] : "未知";
      },
    },
    {
      title: "车牌号",
      dataIndex: "licensePlateNumber",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "核销设备ID",
      dataIndex: "checkDeviceCode",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "人像录入",
      dataIndex: "isFaceRegistered",
      width: 80,
      render(text) {
        return text ? "是" : "否";
      },
    },
    {
      title: "核销设备（核销方式）",
      dataIndex: "checkMode",
      width: 158,
      render(text, creds) {
        return creds.checkDeviceName
          ? `${creds.checkDeviceName}(${text})`
          : "无";
      },
    },
    {
      title: "人工操作",
      dataIndex: "cancelUserName",
      width: 120,
      render(text) {
        return text ? `人工取消/${text}` : "无";
      },
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 150,
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              disabled={creds.status !== 1}
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => {
                showReviewModal(creds);
              }}
            >
              核销
            </Button>
            <Button
              disabled={creds.status !== 1}
              size="small"
              onClick={(e) => {
                showDeleteModal(creds);
              }}
            >
              取消预约
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
              setQuery({ ...query, skipCount: "1", keyword: value })
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
        scroll={{ x: 2120 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
