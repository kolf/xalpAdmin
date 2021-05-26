import React, { useState } from "react";
import { Tabs } from "antd";
import Main from "../Layouts/AppMain";
import DataTable from "./DataTable";

import "./style.less";
const { TabPane } = Tabs;

export default function TicketCategory() {
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
          <TabPane tab="票种管理" key="1" />
        </Tabs>
      }
    >
      {tabKey === "1" && <DataTable />}
    </Main>
  );
}
