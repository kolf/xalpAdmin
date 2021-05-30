import React, { useState } from "react";
import { Tabs } from "antd";
import TabPane1 from "./DataTable5UpdateDateForm";
import TabPane2 from "./DataTable5UpdateDatePickerTable";
import "./style.less";
const { TabPane } = Tabs;

export default function DataTable5UpdateTabs({ defaultValues = {} }) {
  const [tabKey, setTabKey] = useState("1");

  console.log(defaultValues, "defaultValues")

  return (
    <div>
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane
          tab={`${defaultValues.id ? "编辑" : "新增"}预约数量`}
          key="1"
        />
        <TabPane tab="时间段设置" key="2" />
      </Tabs>

      {tabKey === "1" && <TabPane1 defaultValues={defaultValues} />}
      {tabKey === "2" && <TabPane2 defaultValues={defaultValues} />}
    </div>
  );
}
