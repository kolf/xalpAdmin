import React from "react";
import { Row, Col } from "antd";
import "./ProgressArc.less";

export default function ProgressArc({ dataSource }) {
  return (
    <div className="progress-root">
      <Row justify="space-around" align="middle">
        {dataSource.map((item) => (
          <Col
            key={item.key}
            style={{ textAlign: "center" }}
          >
            <div className="progress-cover">
              <div className="progress-value">{item.value}</div>
              <div className="progress-prefix">{item.prefix}</div>
            </div>
            <div className="progress-title">{item.title}</div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
