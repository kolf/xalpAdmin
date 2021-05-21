import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../UI/Main";
import DataTable1 from "./DataTable1";
import DataTable2 from "./DataTable2";
import DataTable3 from "./DataTable3";
import DataTable4 from "./DataTable4";
import DataTable5 from "./DataTable5";
import DataTable6 from "./DataTable6";
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
          <TabPane tab="个人参观" key="1" />
          <TabPane tab="团体参观" key="2" />
          <TabPane tab="工作人员" key="3" />
          <TabPane tab="供应商" key="4" />
          <TabPane tab="预约建议" key="5" />
          <TabPane tab="预约量管理" key="6" />
        </Tabs>
      }
    >
      {tabKey === "1" && <DataTable1 />}
      {tabKey === "2" && <DataTable2 />}
      {tabKey === "3" && <DataTable3 />}
      {tabKey === "4" && <DataTable4 />}
      {tabKey === "5" && <DataTable5 />}
      {tabKey === "6" && <DataTable6 />}
    </Main>
  );
}