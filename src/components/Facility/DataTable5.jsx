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
  Calendar,
  Radio,
} from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./UpdateData3Form";
import blanklistService from "../../services/blanklist.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dataFormat = "YYYY-MM-DD";

export default function DataTable() {
  const [form] = Form.useForm();
  const [showType, setShowType] = useState("1");
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
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.StartTimeStart = start.format(dataFormat) + " 00:00:00";
        result.StartTimeEnd = end.format(dataFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function showDeleteModal(creds) {
    const mod = modal.confirm({ content: `此操作将取消该票, 是否继续?`, onOk });
    function onOk(done) {
      // mod.close()
    }
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm></UpdateDataForm>,
      onOk,
    });
    function onOk(done) {
      // mod.close()
    }
  }

  function showAddModal(creds) {
    const mod = modal({
      title: "添加",
      content: <UpdateDataForm></UpdateDataForm>,
      onOk,
    });
    function onOk(done) {
      // mod.close()
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
      dataIndex: "age",
    },
    {
      title: "联系电话",
      dataIndex: "address",
    },
    {
      title: "类型",
      dataIndex: "user",
    },
    {
      title: "最后修改时间",
      dataIndex: "num",
    },
    {
      title: "预约时间段",
      dataIndex: "phone",
    },
    {
      title: "剩余有期天数",
      dataIndex: "phone",
    },
    {
      title: "更新时间",
      dataIndex: "phone",
    },
    {
      title: "有效入园时间",
      dataIndex: "phone",
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 120,
      render() {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showEditModal}
            >
              编辑
            </Button>
            <Button size="small" onClick={showDeleteModal}>
              取消
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
      {showType === "2" && (
        <>
          <Row style={{ paddingBottom: 12 }}>
            <Col flex="auto">
              <Radio.Group
                value={showType}
                size="small"
                onChange={(e) => setShowType(e.target.value)}
              >
                <Radio.Button value="1">日历</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </Col>
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
            dataSource={makeData(dataList)}
            columns={columns}
            pagination={paginationProps}
            size="small"
            bordered
            loading={loading}
          />
        </>
      )}
      {showType === "1" && (
        <>
          <Row style={{ paddingBottom: 12 }}>
            <Col flex="auto">
              <Radio.Group
                value={showType}
                size="small"
                onChange={(e) => setShowType(e.target.value)}
              >
                <Radio.Button value="1">日历</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </Col>
            <Col flex="120px" style={{ textAlign: "right" }}>
              <Space>
                <Button size="small" type="primary" onClick={openFile}>
                  批量上票
                </Button>
              </Space>
            </Col>
          </Row>
          <Calendar style={{ backgroundColor: "transparent" }} />
        </>
      )}
    </div>
  );
}
