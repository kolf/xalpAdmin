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
import UpdateDataForm from "./DataTableUpdateTabs";
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
    keyword: "",
  });

  useEffect(() => {
    let mounted = true;
    loadData();

    async function loadData() {
      setDataList([]);
      setLoading(true);
      try {
        const { items, totalCount } =
          await faciliyService.getReservationTimeSettingList(makeQuery(query));
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
    return data
      .filter((item) => item.timeItems.length > 0)
      .reduce((result, item, i) => {
        const { timeItems } = item;
        return [
          ...result,
          ...timeItems.map((t, j) => ({
            ...item,
            ...t,
            rowKey: i + "-" + j + t.timeItemId,
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
        const res = await faciliyService.deleteReservationTimeSetting({
          isSpecial: false,
          id: creds.id,
        });
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
    console.log(creds,'creds')
    const mod = modal({
      content: <UpdateDataForm defaultValues={creds} onOk={onOk} />,
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

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 50,
      render: expandedRowRender,
    },
    {
      title: "起始日期",
      dataIndex: "startReserveDate",
      width: 200,
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
      width: 110,
      render(text, creds) {
        return creds.startTimeRange + "-" + creds.endTimeRange;
      },
    },
    {
      title: "门票数量",
      dataIndex: "maxTouristsQuantity",
      width: 100,
    },
    {
      title: "个人时段票数量",
      dataIndex: "individualMaxTouristsQuantity",
      width: 120,
    },
    {
      title: "团体时段票数量",
      dataIndex: "groupMaxTouristsQuantity",
      width: 120,
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
              onClick={(e) => showEditModal(creds)}
            >
              编辑
            </Button>
            <Button size="small" onClick={(e) => showDeleteModal(creds)}>
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
    <>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">{renderHeader}</Col>
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
            allowClear
            onSearch={(value) => {
              setQuery({ ...query, skipCount: "1", keyword: value });
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
        rowKey="rowKey"
        scroll={{ x: 760 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
}
