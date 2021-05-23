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
  Pagination,
  message,
} from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import DataTableCalendar from "./DataTable5Calendar";
import DataTableList from "./DataTable5List";
import faciliyService from "../../services/faciliy.service";
import { reviewOptions } from "../../shared/options";
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
        result.StartTimeStart = start.format(dataFormat) + " 00:00:00";
        result.StartTimeEnd = end.format(dataFormat) + " 23:59:59";
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
        const res = await faciliyService.deleteReservationTimeSetting(creds);
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

  function openFile() {}


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
       
          <DataTableList />
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
          <DataTableCalendar />
        </>
      )}
    </div>
  );
}
