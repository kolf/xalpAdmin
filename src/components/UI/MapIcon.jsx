import React, { useState, useEffect } from 'react';
import { Row, Col, Space } from 'antd';
import ReactHlsPlayer from 'react-hls-player';
import icon1Url from '../../assets/img/icon1.png';
import icon2Url from '../../assets/img/icon2.png';
import iconxUrl from '../../assets/img/remove.png';
import iconoUrl from '../../assets/img/reload.png';
import './MapIcon.less';

export default function MapIcon({ dataSource }) {
  return (
    <div className='mapicon-root'>
      <div className='mapicon-img' data-item={JSON.stringify(dataSource)}>
        <img
          src={dataSource.deviceType === 1 ? icon1Url : icon2Url}
          width={30}
        />
      </div>

      <div className='mapicon-container'>
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
        {dataSource.deviceType === 1 ? (
          <div className='mapicon-body'>
            <div className='mapicon-title'>数据面板</div>
            <div className='mapicon-content' />
          </div>
        ) : (
          <div
            className='mapicon-body'
            style={{
              padding: 0,
              backgroundColor: 'transparent',
              borderTop: 'none',
            }}>
            <ReactHlsPlayer
              src='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
              autoPlay={false}
              controls={true}
              width='100%'
              height={160}
            />
          </div>
        )}
      </div>
    </div>
  );
}
