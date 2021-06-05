import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Row, Col, Space, Pagination } from "antd";
import UpdateDataForm from "./UpdateDataForm";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import ticketCategoryService from "../../services/ticket-category.service";
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";
const secFormat = "YYYY-MM-DD hh:mm:ss";

export default function DataTable() {
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
    loadData();
  }, [JSON.stringify(query), counter]);

  async function loadData() {
    setLoading(true);
    try {
      const { items, totalCount } = await ticketCategoryService.getProductList(
        makeQuery(query)
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
      return { ...item.product, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        ProductType: 0,
      }
    );
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将删除此票种, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await ticketCategoryService.deleteProduct(creds);
        mod.close();
        utils.success(`删除成功！`);
        setCounter(counter + 1);
        loadData({
          skipCount: "1",
        });
      } catch (error) {
        mod.close();
      }
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

  async function openFile() {
    try {
      const res = await ticketCategoryService.exportProductList(
        makeQuery(query)
      );
      window.open(res)
      console.log(res, "res");
    } catch (error) {
      utils.error(`下载失败！`);
    }
  }

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "是否启用",
      dataIndex: "isActive",
      render(text, creds) {
        return text ? "已启用" : "未启用";
      },
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
              onClick={e => showEditModal(creds)}
            >
              编辑
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
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
      >
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"  allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        rowKey="creatorId"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        // scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
