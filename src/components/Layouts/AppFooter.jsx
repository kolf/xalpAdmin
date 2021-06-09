import React from "react";
import { Layout, Row, Col } from "antd";

import "./AppFooter.less";

export default function AppFooter({ onClick }) {
  const handleClick = (key) => {
    onClick && onClick(key);
  };
  return (
    <div className="appFooter-root">
      <div className="appFooter-heading">告警图例</div>
      <div className="appFooter-body">
        <Row>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div className="appFooter-item" onClick={(e) => handleClick("1")}>
              <div
                className="appFooter-item-cover"
                style={{ background: "#4cd8fc" }}
              ></div>
              <div className="appFooter-item-title">设备正常</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div className="appFooter-item" onClick={(e) => handleClick("2")}>
              <div
                className="appFooter-item-cover"
                style={{ background: "#27fed4" }}
              ></div>
              <div className="appFooter-item-title">设备运行</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div className="appFooter-item" onClick={(e) => handleClick("3")}>
              <div
                className="appFooter-item-cover"
                style={{ background: "#929da0" }}
              ></div>
              <div className="appFooter-item-title">设备离线</div>
            </div>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <div className="appFooter-item" onClick={(e) => handleClick("4")}>
              <div
                className="appFooter-item-cover"
                style={{ background: "#e45456" }}
              ></div>
              <div className="appFooter-item-title">设备故障</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
