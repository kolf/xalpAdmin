import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../Layouts/AppMain";
import DataTable1 from "./DataTable1";
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
          <TabPane tab="过闸数据统计" key="1"></TabPane>
        </Tabs>
      }
    >
      {tabKey === "1" && <DataTable1 />}
    </Main>
  );
}
