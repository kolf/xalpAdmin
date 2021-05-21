import React from "react";
import { Layout, Row, Col } from "antd";

import "./AppFooter.less";

export default function AppFooter({ onClick }) {
  const handleClick = (key, e) => {
    e.preventDefault();
    onClick && onClick(key);
  };
  return (
    <div className="appFooter-root">
      <div className="appFooter-heading">告警图例</div>
      <div className="appFooter-body">
        <Row>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="appFooter-item"
              onClick={handleClick.bind(this, "1")}
            >
              <div className="appFooter-item-cover"></div>
              <div className="appFooter-item-title">设备正常</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="appFooter-item"
              onClick={handleClick.bind(this, "2")}
            >
              <div className="appFooter-item-cover"></div>
              <div className="appFooter-item-title">设备运行</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="appFooter-item"
              onClick={handleClick.bind(this, "3")}
            >
              <div className="appFooter-item-cover"></div>
              <div className="appFooter-item-title">设备离线</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="appFooter-item"
              onClick={handleClick.bind(this, "4")}
            >
              <div className="appFooter-item-cover"></div>
              <div className="appFooter-item-title">设备故障</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
