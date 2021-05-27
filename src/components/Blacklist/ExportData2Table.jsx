import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Space, Select } from "antd";
import policeService from "../../services/police.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default function DataTable({ id }) {
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
      const { items, totalCount } = await policeService.getDeviceLogList(
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
    return data.map((item, index) => {
      return { ...item.device, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (key === "date" && value) {
          const [start, end] = value;
          result.StartTime = start.format(dateFormat) + " 00:00:00";
          result.EndTime = end.format(dateFormat) + " 23:59:59";
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        DeviceId: id,
      }
    );
  }

  function openTemplateFile() {}

  function exportTableData() {}

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
    },
    {
      title: "程度",
      dataIndex: "behaviorType",
    },
    {
      title: "行为",
      dataIndex: "name",
    },
    {
      title: "惩罚措施",
      dataIndex: "note",
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
      <div style={{ paddingBottom: 12 }}>
        <Space>
          <Button size="small" type="primary" onClick={openTemplateFile}>
            模板下载
          </Button>
          <Button size="small" type="primary" onClick={exportTableData}>
            表格导入
          </Button>
        </Space>
      </div>

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
