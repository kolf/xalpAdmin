import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import DataTable1 from "./DataTable1";
import DataTable2 from "./DataTable2";
const { TabPane } = Tabs;

export default function DetailsDataTabs() {
  const [tabKey, setTabKey] = useState("1");

  return (
    <>
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane tab="客源分析" key="1"></TabPane>
        <TabPane tab="年龄分布" key="2"></TabPane>
      </Tabs>

      {tabKey === "1" && <DataTable1></DataTable1>}
      {tabKey === "2" && <DataTable2></DataTable2>}
    </>
  );
}
