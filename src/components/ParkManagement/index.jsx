import React from "react";
import { Layout } from "antd";
import DataForm from "./DataForm";
import DataTable from "./DataTable";
const { Sider, Content } = Layout;

export default function ParkMangement() {
  return (
    <Layout style={{ height: "100%", backgroundColor: "transparent" }}>
      <Sider
        width={400}
        style={{ backgroundColor: "transparent", padding: "24px" }}
      >
        <div className="bg-primary">
          <div className="panel-heading">入园概览</div>
          <div className="panel-body">dsfsdaf</div>
          <div className="panel-heading">入园数据</div>
          <div className="panel-body">
            <DataForm />
          </div>
        </div>
      </Sider>
      <Content style={{ padding: "24px 24px 24px 0" }}>
        <div className="bg-primary">
          <DataTable />
        </div>
      </Content>
    </Layout>
  );
}
