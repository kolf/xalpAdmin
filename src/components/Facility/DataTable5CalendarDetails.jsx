import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Select } from "antd";
const dateFormat = "YYYY-MM-DD";

export default function DataTable({ id, dataSource }) {
  function makeData(data) {
    if(!data){
      return []
    }
    console.log(data, "data");
    return data.timeRanges.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  const columns = [
    {
      title: "时段",
      dataIndex: "TimeRange",
      render(text, creds) {
        const { startTimeRange, endTimeRange } = creds;
        if (startTimeRange === "00:00" && endTimeRange === "24:00") {
          return "全天";
        }
        return startTimeRange + "-" + endTimeRange;
      },
    },
    {
      title: "门票数量/剩余数量",
      dataIndex: "remainTouristsQuantity",
      render(text, creds) {
        return creds.remainTouristsQuantity + "/" + creds.touristsCount;
      },
    },
    {
      title: "个人时段票数量/剩余数量",
      dataIndex: "touristsCount",
      render(text, creds) {
        return creds.remainTouristsQuantity + "/" + creds.touristsCount;
      },
    },
    {
      title: "团体时段票数量/剩余数量",
      dataIndex: "touristsCount",
      render(text, creds) {
        return creds.remainTouristsQuantity + "/" + creds.touristsCount;
      },
    },
    {
      title: "库存提示",
      dataIndex: "msg",
      render(text, creds) {
        return text || "无";
      },
    },
  ];

  return (
    <div>
      <div className="calendar-details-title">{id}</div>
      <Table
        rowKey="id"
        dataSource={makeData(dataSource)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
}
