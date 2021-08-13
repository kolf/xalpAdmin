import React, { useState, useEffect } from 'react';
import { Row, Col, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import icon1Url from '../../assets/img/icon1.png';
import iconxUrl from '../../assets/img/remove.png';
import iconoUrl from '../../assets/img/reload.png';
import './MapIcon.less';

export default function MapIcon({ dataSource }) {
  return (
    <div className='mapicon-root'>
      <div className='mapicon-img' data-item={dataSource}>
        <img src={icon1Url} width={30}></img>
      </div>

      <div className='mapicon-container hide'>
        <div className='mapicon-heading'>
          <span className='mapicon-name' title={dataSource.name}>
            {dataSource.name}
          </span>
          <div className='mapicon-more'>
            <Space>
              <img src={iconoUrl} width={10} className='mapicon-reload' />
              <img src={iconxUrl} width={10} className='mapicon-close' />
            </Space>
          </div>
        </div>
        <div className='mapicon-body'>
          <div className='mapicon-title'>数据面板</div>
          <div className='mapicon-content'>
            {/* <Row>
              <Col flex="auto">设备状态</Col>
              <Col style={{ textAlign: "right" }}>开启</Col>
            </Row>
            <Row>
              <Col flex="auto">在线状态</Col>
              <Col style={{ textAlign: "right" }}>在线</Col>
            </Row>
            <Row>
              <Col flex="auto">今日通行人数</Col>
              <Col style={{ textAlign: "right" }}>0人</Col>
            </Row> */}
          </div>
        </div>
      </div>
    </div>
  );
}
