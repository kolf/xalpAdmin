import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Progress, Tabs } from "antd";
import DataForm from "./DataForm";
import ProgressArc from "../UI/ProgressArc";
import AdmissionChart from "./AdmissionChart";
import TouristChart from "./TouristChart";
import modal from "../../shared/modal";
import "./Sidebar.less";

export default function Sidebar() {
  const [height, setHeight] = useState(640);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    setHeight(windowHeight - 102);
  }, []);

  return (
    <div className="sidebar-root" style={{ maxHeight: height }}>
      <Row style={{ padding: "12px 0", marginLeft: "140px" }}>
        <Col span={8}>
          <div className="sidebar-heading-num">04</div>
          <div>设备总数</div>
        </Col>
        <Col span={8}>
          <div className="sidebar-heading-num">04</div>
          <div>在线设备</div>
        </Col>
        <Col span={8}>
          <div className="sidebar-heading-num">01</div>
          <div>离线设备</div>
        </Col>
      </Row>
      <div className="panel-heading">入园概览</div>
      <div className="panel-body">
        <ProgressArc
          dataSource={[
            {
              value: "34",
              prefix: "个",
              title: [<div>今日预约</div>, <div>人数</div>],
            },
            {
              value: "02",
              prefix: "个",
              title: [<div>今日已核销</div>, <div>人数</div>],
            },
            {
              value: "08",
              prefix: "个",
              title: [<div>当季预约</div>, <div>人数</div>],
            },
            {
              value: "12",
              prefix: "个",
              title: [<div>当季已核销</div>, <div>人数</div>],
            },
          ]}
        />
      </div>
      <div className="panel-heading">入园数据</div>
      <div className="panel-body">
        <DataForm />
        <AdmissionChart />
      </div>
      <div className="panel-footer" style={{ marginTop: -24 }}>
        <a href="" style={{ marginLeft: "auto" }}>
          导出数据
        </a>
      </div>
      <div className="panel-heading">当月游客分析</div>
      <div className="panel-body">
        <TouristChart />
        <Row>
          <Col span={4}>
            <span
              className="iconfont1"
              style={{ fontSize: 18, lineHeight: 1.2 }}
            >
              TOP1
            </span>
          </Col>
          <Col span={3}>湖北</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
        <Row style={{ padding: "12px 0" }}>
          <Col span={4}>
            <span
              className="iconfont1"
              style={{ fontSize: 18, lineHeight: 1.2 }}
            >
              TOP2
            </span>
          </Col>
          <Col span={3}>北京</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <span
              className="iconfont1"
              style={{ fontSize: 18, lineHeight: 1.2 }}
            >
              TOP3
            </span>
          </Col>
          <Col span={3}>天津</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
      </div>
      <div className="panel-footer" style={{ marginTop: 0 }}>
        <Link to='/data' style={{ marginLeft: "auto" }}>
          查看更多
        </Link>
      </div>
    </div>
  );
}
