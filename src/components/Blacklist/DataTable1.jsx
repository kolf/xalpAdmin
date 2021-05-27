import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Button, DatePicker, Form, Input, Row, Col, Space } from "antd";
import UpdateDataForm from "./UpdateData1Form";
import ExportDataTable from "./ExportData1Table";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";

import blanklistService from "../../services/blanklist.service";
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
      return {
        ...item,
        ...item.blockAllowUser,
        blockAllowUser: undefined,
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
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showAddModal() {
    const mod = modal({
      title: "新增",
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      utils.success("添加成功！");
      loadData({
        skipCount: "1",
      });
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm onOk={onOk} defaultValues={creds} />,
      footer: null,
    });

    function onOk() {
      mod.close();
      utils.success("更新成功！");
      loadData({
        skipCount: "1",
      });
    }
  }

  function showExportModal(creds) {
    const mod = modal({
      title: "批量导入",
      width: 720,
      content: <ExportDataTable onOk={onOk} />,
      footer: null,
    });

    function onOk() {
      mod.close();
    }
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `确认删除此条内容, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await blanklistService.deleteBlockAllowUser({
          id: creds.id,
        });
        mod.close();
        utils.success(`删除成功！`);
        loadData({ skipCount: "1" });
      } catch (error) {
        mod.close();
        utils.error(error.error.message || `删除失败！`);
      }
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
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "身份证",
      dataIndex: "certNumber",
    },
    {
      title: "不文明行为",
      dataIndex: "behaviorName",
    },
    {
      title: "不文明行为发生时间",
      dataIndex: "startTime",
    },
    {
      title: "距离处理到期天数",
      dataIndex: "daysOfEndBlock",
    },
    {
      title: "处罚",
      dataIndex: "behaviorDescription",
    },
    {
      title: "操作",
      dataIndex: "options",
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
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total,
    position: ["", "bottomCenter"],
  };

  return (
    <div>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">
          <Space>
            <span>黑名单人数:</span>
            <span className="iconfont1 text-danger">1223</span>
            <span>当前限制人数:</span>
            <span className="iconfont1 text-danger">1223</span>
          </Space>
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
        rowKey="id"
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
