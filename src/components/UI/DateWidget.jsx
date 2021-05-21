import React, { useState, useEffect } from "react";
import moment from "moment";
import { Space } from "antd";
import "./DateWidget.less";

const days = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
];

export default function DateWidget() {
  const [date, setDate] = useState(moment());
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(moment());
    }, 1000);
  });

  return (
    <div className="date-widget-root">
      <Space>
        <div>{date.format("HH:mm:ss")}</div>
        <div>
          <div>{days[date.day() - 1]}</div>
          <div>{date.format("YYYY年MM月DD日")}</div>
        </div>
      </Space>
    </div>
  );
}
