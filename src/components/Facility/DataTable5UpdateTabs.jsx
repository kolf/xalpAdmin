import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../UI/Main";
import TabPane1 from "./DataTable5UpdateDateForm";
import TabPane2 from "./DataTable5UpdateDatePickerTable";
import "./style.less";
const { TabPane } = Tabs;

export default function DataTable5UpdateTabs() {
  const [tabKey, setTabKey] = useState("1");

  return (
    <div>
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane tab="新增预约数量" key="1" />
        <TabPane tab="时间段设置" key="2" />
      </Tabs>

      {tabKey === "1" && <TabPane1 />}
      {tabKey === "2" && <TabPane2 />}
    </div>
  );
}
