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
import UpdateDataForm from "./UpdateData3Form";
import ImportDataTable from "./ImportData3Table";
import moment from "moment";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import faciliyService from "../../services/faciliy.service";
import dataService from "../../services/data.service";
import { reviewOptions } from "../../shared/options";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const secFormat = "YYYY-MM-DD HH:mm:ss";

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
    let mounted = true;
    loadData();
    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } = await faciliyService.getMerchantList(
          makeQuery(query)
        );
        if(mounted) {
          setLoading(false);
        setDataList(items);
        setTotal(totalCount);
        }
      } catch (error) {
        if(mounted) {
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
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.startPermissionDate = start.format(dateFormat) + " 00:00:00";
        result.endPermissionDate = end.format(dateFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
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
      content: `此操作将删除此供应商, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await faciliyService.deleteMerchant(creds);
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
      title: "编辑",
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

  function showImportModal(creds) {
    const mod = modal({
      title: "批量导入",
      width: 800,
      content: <ImportDataTable onOk={onOk} />,
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
      const res = await dataService.exportMerchantList(makeQuery(query));
      window.open(res);
    } catch (error) {}
  }

  const columns = [
    {
      title: "供应商名称",
      dataIndex: "name",
    },
    {
      title: "负责人姓名",
      dataIndex: "handlerName",
    },
    {
      title: "联系电话",
      dataIndex: "handlerPhone",
    },
    {
      title: "供应商类型",
      dataIndex: "merchantTypeName",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "最后修改时间",
      dataIndex: "lastModificationTime",
      render(text) {
        return text ? moment(text).format(secFormat) : "无";
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
            <Button size="small" type="primary" onClick={showImportModal}>
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
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
      >
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, keyword: value, skipCount: "1" })
            }
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
        // scroll={{ x: 1200 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}