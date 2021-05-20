import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../UI/Main";
import DataTable from "./DataTable";
import "./style.less";
const { TabPane } = Tabs;

export default function Home() {
  const [show, setShow] = useState(true);
  const [tabKey, setTabKey] = useState("1");
  if (!show) {
    return null;
  }
  return (
    <Main
      show={show}
      onClose={(e) => {
        setShow(false);
      }}
      header={
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          <TabPane tab="设备信息" key="1" />
        </Tabs>
      }
    >
      {tabKey === "1" && <DataTable />}
    </Main>
  );
}
