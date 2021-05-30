import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import dataService from "../../services/data.service";

export default function DeviceTotal() {
  const [data, setData] = useState({
    offlineCount: 0,
    onlineCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    loadData();

    async function loadData() {
      const res = await dataService.getDeviceTotal();
      setData(res);
    }
  }, []);

  return (
    <Row>
      <Col span={8}>
        <div className="sidebar-heading-num">{data.totalCount}</div>
        <div>设备总数</div>
      </Col>
      <Col span={8}>
        <div className="sidebar-heading-num">{data.onlineCount}</div>
        <div>在线设备</div>
      </Col>
      <Col span={8}>
        <div className="sidebar-heading-num">{data.offlineCount}</div>
        <div>离线设备</div>
      </Col>
    </Row>
  );
}
