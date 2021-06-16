import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../Layouts/AppMain";
import DataTable1 from "./DataTable1";
import DataTable2 from "./DataTable2";
import DataTable3 from "./DataTable3";
import DataTable4 from "./DataTable4";
import "./style.less";
const { TabPane } = Tabs;

function Facility() {
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
          <TabPane tab="服务商人员" key="4" />
        </Tabs>
      }
    >
      {tabKey === "1" && <DataTable1 />}
      {tabKey === "2" && <DataTable2 />}
      {tabKey === "3" && <DataTable3 />}
      {tabKey === "4" && <DataTable4 />}
    </Main>
  );
}
export default React.memo(Facility);
