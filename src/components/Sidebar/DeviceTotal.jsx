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
    let mounted = true;
    loadData();

    async function loadData() {
      const res = await dataService.getDeviceTotal();
      if (mounted) {
        setData(res);
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Row>
      <Col span={12}>
        <div className="sidebar-heading-num">{data.totalCount}</div>
        <div>闸机总数</div>
      </Col>
      <Col span={12}>
        <div className="sidebar-heading-num">{data.onlineCount}</div>
        <div>在线闸机</div>
      </Col>
    </Row>
  );
}
