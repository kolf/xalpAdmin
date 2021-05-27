import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Pagination,
  message,
} from "antd";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import UpdateDataForm from "./DataTable5UpdateTabs";
import faciliyService from "../../services/faciliy.service";

const { RangePicker } = DatePicker;
const { Search } = Input;

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
        await faciliyService.getReservationTimeSettingList(
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
      return { ...item, index: index + 1 };
    });
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
        mod.close()
        utils.success(`删除成功！`);
        
        loadData({
          skipCount: "1",
        });
      } catch (error) {
        mod.close()
      }
    }
  }

  function showEditModal(creds) {
    console.log(creds, "creds");
    const mod = modal({
      content: (
        <UpdateDataForm defaultValues={creds} onOk={onOk}></UpdateDataForm>
      ),
      footer: null,
    });
    function onOk(done) {
      mod.close();
      loadData({
        skipCount: "1",
      });
    }
  }

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
    },
    {
      title: "起始日期",
      dataIndex: "startReserveDate",
      render(text, creds) {
        return `${moment(creds.startReserveDate).format(dateFormat)}至${moment(
          creds.endReserveDate
        ).format(dateFormat)}`;
      },
    },
    {
      title: "单日时段",
      dataIndex: "address",
    },
    {
      title: "门票数量/已预约数量",
      dataIndex: "user",
      render: (text) => text || "3000 / 2401",
    },
    {
      title: "库存提示",
      dataIndex: "dailyMaxTouristsQuantity",
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 120,
      render(text, creds) {
        return (
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
    onChange(value) {
      loadData({
        skipCount: value + "",
      });
    },
  };

  return (
    <>
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
        rowKey="creatorId"
        // scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
}
