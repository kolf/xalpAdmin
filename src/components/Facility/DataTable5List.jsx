import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Col,
  Space,
} from "antd";
import UpdateDataForm from "./DataTable5UpdateTabs";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import faciliyService from "../../services/faciliy.service";

const { RangePicker } = DatePicker;
const { Search } = Input;

const dateFormat = "YYYY-MM-DD";

const expandedRowRender = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (row.index !== -1) {
    obj.props.rowSpan = row.size;
  } else {
    obj.props.rowSpan = 0;
  }

  return obj;
};

export default function DataTable({ renderHeader }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
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
    setDataList([]);
    setLoading(true);
    try {
      const { items, totalCount } =
        await faciliyService.getReservationTimeSettingList(makeQuery(query));
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
    return data
      .filter((item) => item.timeItems.length > 0)
      .reduce((result, item, i) => {
        const { timeItems } = item;
        return [
          ...result,
          ...timeItems.map((t, j) => ({
            ...item,
            ...t,
            index: j === 0 ? i + 1 : -1,
            size: timeItems.length,
          })),
        ];
      }, []);
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.StartTime = start.format(dateFormat) + " 00:00:00";
        result.EndTime = end.format(dateFormat) + " 23:59:59";
      } else if (value && value !== "-1") {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将删除这条数据, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await faciliyService.deleteReservationTimeSetting(creds);
        mod.close();
        utils.success(`删除成功！`);
        setCounter(counter + 1);
        setQuery({
          ...query,
          skipCount: "1",
        });
      } catch (error) {
        mod.close();
      }
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      content: (
        <UpdateDataForm defaultValues={creds} onOk={onOk}/>
      ),
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

  function openFile() {}

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      width:54,
      render: expandedRowRender,
    },
    {
      title: "起始日期",
      dataIndex: "startReserveDate",
      render(text, creds, index) {
        const value = `${moment(creds.startReserveDate).format(
          dateFormat
        )}至${moment(creds.endReserveDate).format(dateFormat)}`;
        return expandedRowRender(value, creds, index);
      },
    },
    {
      title: "单日时段",
      dataIndex: "TimeRange",
      width:110,
      render(text, creds) {
        return creds.startTimeRange + "-" + creds.endTimeRange;
      },
    },
    {
      title: "门票数量/剩余数量",
      dataIndex: "maxTouristsQuantity",
      render(text, creds) {
        const maxNum =
          creds.maxTouristsQuantity + creds.groupMaxTouristsQuantity;
        const currentNum =
          creds.individualWarningLeftQuantity + creds.groupWarningLeftQuantity;
        return maxNum + "/" + currentNum;
      },
    },
    {
      title: "个人时段票数量/剩余数量",
      dataIndex: "individualMaxTouristsQuantity",
      render(text, creds) {
        if (!text && text !== 0) {
          return "无";
        }
        return (
          creds.individualMaxTouristsQuantity +
          "/" +
          creds.individualWarningLeftQuantity
        );
      },
    },
    {
      title: "团体时段票数量/剩余数量",
      dataIndex: "groupMaxTouristsQuantity",
      render(text, creds) {
        if (!text && text !== 0) {
          return "无";
        }
        return (
          creds.groupMaxTouristsQuantity + "/" + creds.groupWarningLeftQuantity
        );
      },
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 120,
      render(text, creds, index) {
        const buttons = (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showEditModal.bind(this, creds)}
            >
              编辑
            </Button>
            <Button size="small" onClick={showDeleteModal.bind(this, creds)}>
              删除
            </Button>
          </div>
        );
        return expandedRowRender(buttons, creds, index);
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
    <>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">{renderHeader}</Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={showAddModal}>
              新增
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
        onFinish={(values) => {
          setQuery({ ...query, ...values, skipCount: "1" });
        }}
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
          <Search
            size="small"
            placeholder="模糊搜索"
            onSearch={(value) => {
              setQuery({ ...query, skipCount: "1", Keyword: value });
            }}
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
        scroll={{ x: 900 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
}
