import React, { useState, useEffect } from "react";
import moment from "moment";
import { Space } from "antd";
import "./DateWidget.less";

const days = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

export default React.memo(function DateWidget() {
  const [date, setDate] = useState(moment());
  useEffect(() => {
    let timer = setInterval(() => {
      if (timer) {
        setDate(moment());
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, []);

  return (
    <div className="date-widget-root">
      <Space>
        <div>{date.format("HH:mm:ss")}</div>
        <div>
          <div>{days[date.day()]}</div>
          <div>{date.format("YYYY年MM月DD日")}</div>
        </div>
      </Space>
    </div>
  );
});
