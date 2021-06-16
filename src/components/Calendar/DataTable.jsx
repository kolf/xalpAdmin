import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import DataTableCalendar from "./DataTableCalendar";
import DataTableList from "./DataTableList";

export default function DataTable() {
  const [showType, setShowType] = useState("1");

  return (
    <div>
      {showType === "2" && (
        <DataTableList
          renderHeader={
            <Radio.Group
              value={showType}
              size="small"
              onChange={(e) => setShowType(e.target.value)}
            >
              <Radio.Button value="1">日历</Radio.Button>
              <Radio.Button value="2">列表</Radio.Button>
            </Radio.Group>
          }
        />
      )}
      {showType === "1" && (
        <DataTableCalendar
          renderHeader={
            <Radio.Group
              value={showType}
              size="small"
              onChange={(e) => setShowType(e.target.value)}
            >
              <Radio.Button value="1">日历</Radio.Button>
              <Radio.Button value="2">列表</Radio.Button>
            </Radio.Group>
          }
        />
      )}
    </div>
  );
}
