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
import UpdateDataForm from "./UpdateData4Form";
import faciliyService from "../../services/faciliy.service";
import { reviewOptions } from "../../shared/options";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dataFormat = "YYYY-MM-DD";

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
      const { items, totalCount } = await faciliyService.getMerchantList(
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
        result.startPermissionDate = start.format(dataFormat) + " 00:00:00";
        result.endPermissionDate = end.format(dataFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function showDeleteModal(creds) {
    const mod = modal.confirm({
      content: `此操作将删除此供应商, 是否继续?`,
      onOk,
    });
    async function onOk(done) {
      try {
        const res = await faciliyService.deleteMerchant(creds);
        message.success(`删除成功！`);
        mod.destroy();
        loadData({
          skipCount: "1",
        });
      } catch (error) {
        mod.destroy();
      }
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
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

  function showAddModal() {
    const mod = modal({
      title: "新增",
      content: <UpdateDataForm onOk={onOk}></UpdateDataForm>,
      footer: null,
    });
    function onOk(done) {
      mod.close();
      loadData({
        skipCount: "1",
      });
    }
  }

  function showExportModal(creds) {
    const mod = modal({
      title: "添加",
      content: <UpdateDataForm onOk={onOk}></UpdateDataForm>,
    });
    function onOk(done) {
      mod.close();
      loadData();
    }
  }

  function openFile() {}

  const columns = [
    {
      title: "供应商名称",
      dataIndex: "name",
    },
    {
      title: "姓名",
      dataIndex: "handlerName",
    },
    {
      title: "联系电话",
      dataIndex: "handlerPhone",
    },
    {
      title: "类型",
      dataIndex: "merchantTypeName",
      render(text) {
        return text || "/";
      },
    },
    {
      title: "最后修改时间",
      dataIndex: "lastModificationTime",
      render(text) {
        return text || "/";
      },
    },
    {
      title: "预约时间",
      dataIndex: "openingHours",
      render(text) {
        return text || "/";
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render(text, creds) {
        return "正常";
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
        rowKey="creatorId"
        // scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
