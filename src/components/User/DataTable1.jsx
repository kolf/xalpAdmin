import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Button, DatePicker, Form, Input, Row, Col, Space,Pagination } from "antd";
import UpdateDataForm from "./UpdateData1Form";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import userService from "../../services/user.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";
const secFormat = "YYYY-MM-DD hh:mm:ss";

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
      const { items, totalCount } = await userService.getUserList(
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

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm onOk={onOk} defaultValues={creds} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      loadData({
        skipCount: "1",
      });
    }
  }
  function openFile() {}

  const columns = [
    {
      title: "工号",
      dataIndex: "jobNumber",
    },
    {
      title: "姓名",
      dataIndex: "userName",
    },
    {
      title: "角色名称",
      dataIndex: "roleNames",
    },
    {
      title: "操作",
      dataIndex: "options",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button size="small" onClick={showEditModal.bind(this, creds)}>
              编辑角色
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
        <Col flex="auto"></Col>
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
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
