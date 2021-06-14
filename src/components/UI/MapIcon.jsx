import React, { useState, useEffect } from "react";
import { Row, Col, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import icon1Url from "../../assets/img/icon1.png";
import iconxUrl from "../../assets/img/remove.png";
import iconoUrl from "../../assets/img/reload.png";
import "./MapIcon.less";

export default function MapIcon() {
  return (
    <div className="mapicon-root">
      <div className="mapicon-img">
        <img src={icon1Url} width={30}></img>
      </div>

      <div className="mapicon-container">
        <div className="mapicon-heading">
          <span>1号出口闸机</span>
          <div className="mapicon-more">
            <Space>
              <img src={iconoUrl} width={10} className='mapicon-reload' />
              <img src={iconxUrl} width={10} className='mapicon-close'/>
            </Space>
          </div>
        </div>
        <div className="mapicon-body">
          <div className="mapicon-title">数据面板</div>
          <div className="mapicon-content">
            <Row>
              <Col flex="auto">设备状态</Col>
              <Col style={{ textAlign: "right" }}>执行中</Col>
            </Row>
            <Row>
              <Col flex="auto">今日通行人数</Col>
              <Col style={{ textAlign: "right" }}>751人</Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
