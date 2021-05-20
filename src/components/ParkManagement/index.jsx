import React from "react";
import { Layout } from "antd";
const { Sider, Content } = Layout;

export default function ParkMangement() {
  return (
    <Layout style={{ height: "100%", backgroundColor: "transparent" }}>
      <Sider width={360} style={{ backgroundColor: "transparent", padding: "24px"}}>
        <div className="bg-primary">
          <div className="panel-title">入园概览</div>
        </div>
      </Sider>
      <Content style={{ padding: "24px 24px 24px 0" }}>
        <div className="bg-primary">dsf</div>
      </Content>
    </Layout>
  );
}
