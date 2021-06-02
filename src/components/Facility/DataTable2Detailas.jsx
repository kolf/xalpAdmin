import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Select, Pagination } from "antd";
import policeService from "../../services/police.service";
import { checkDeviceTypeEnum } from "../../shared/options";

export default function DataTable() {
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    loadData();
  }, [JSON.stringify(query), counter]);

  async function loadData() {
    setLoading(true);
    try {
      const { items, totalCount } = await policeService.getDeviceList(
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
      return { ...item, ...item.device, device: undefined, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (key === "isOnline" && value) {
        result[key] = value === "1";
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "参观人姓名",
      dataIndex: "name",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "身份证",
      dataIndex: "certNumber",
      render(text) {
        return checkDeviceTypeEnum[text] || "未知";
      },
    },
    {
      title: "客源地",
      dataIndex: "regionProvince",
      render(text) {
        return text || "无";
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
    <>
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
    </>
  );
}
