import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Pagination,
} from "antd";
import UpdateDataForm from "./UpdateData1Form";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";

import blanklistService from "../../services/blanklist.service";
import dataService from "../../services/data.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";
const secFormat = "YYYY-MM-DD hh:mm:ss";

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalArr, setTotalArr] = useState([0, 0]);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    keyword: "",
  });

  useEffect(() => {
    loadData();
  }, [JSON.stringify(query), counter]);

  async function loadData() {
    setLoading(true);
    try {
      const { items, totalCount } =
        await blanklistService.getBlockAllowUserList(makeQuery(query));
      const { totalBlockingCount, totalCount: AllTotalCount } =
        await blanklistService.getBlockAllowUserList();
      setLoading(false);
      setDataList(items);
      setTotalArr([AllTotalCount, totalBlockingCount]);
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
      setCounter(counter + 1);
      setQuery({
        ...query,
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
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: "1",
      });
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
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
    }
  }

  const columns = [
    {
      title: "活动名称",
      dataIndex: "name",
    },
    {
      title: "举办地址",
      dataIndex: "phone",
    },
    {
      title: "活动状态",
      dataIndex: "certNumber",
    },
    {
      title: "活动举办时间",
      dataIndex: "behaviorName",
    },
    {
      title: "报名状态",
      dataIndex: "startTime",
      render(text) {
        return text ? moment(text).format(secFormat) : "无";
      },
    },
    {
      title: "报名起止时间",
      dataIndex: "historyBehaviorName",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "最后操作人",
      dataIndex: "behaviorDescription",
    },
    {
      title: "操作",
      dataIndex: "options",
      width:230,
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={e => showEditModal(creds)}
            >
              查看
            </Button>
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={e => showEditModal(creds)}
            >
              编辑
            </Button>
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={e => showEditModal(creds)}
            >
              下架
            </Button>
            <Button size="small" onClick={e => showDeleteModal(creds)}>
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
        <Col flex="auto"></Col>
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
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
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
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
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
        scroll={{ x:1200}}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
