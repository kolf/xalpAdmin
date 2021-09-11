import React, { useState, useEffect } from 'react';
import { Row, Col, Space } from 'antd';
<<<<<<< HEAD
import DPlayer from 'dplayer';
import ReactHlsPlayer from 'react-hls-player';
import monitorDefault from '../../assets/img/monitor-default.png';
import monitorError from '../../assets/img/monitor-error.png';
import monitorOffline from '../../assets/img/monitor-offline.png';

import turnstileDefault from '../../assets/img/turnstile-default.png';
import turnstileError from '../../assets/img/turnstile-error.png';
import turnstileOffline from '../../assets/img/turnstile-offline.png';

=======
import ReactHlsPlayer from 'react-hls-player';
import icon1Url from '../../assets/img/icon1.png';
import icon2Url from '../../assets/img/icon2.png';
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
import iconxUrl from '../../assets/img/remove.png';
import iconoUrl from '../../assets/img/reload.png';
import './MapIcon.less';

function getIconUrl(dataSource) {
  const { deviceType, isOnline, isActive, privateM3u8Url } = dataSource;
  if (deviceType === 1) {
    if (!isOnline) {
      return turnstileOffline;
    }
    if (!isActive) {
      return turnstileError;
    }
    return turnstileDefault;
  } else if (deviceType === 2) {
    if (!privateM3u8Url) {
      return monitorError;
    }
    // if (!isOnline) {
    //   return monitorOffline;
    // }
    // if (!isActive) {
    //   return monitorError;
    // }
    return monitorDefault;
  }
}

export default function MapIcon({ dataSource }) {
  // console.log(dataSource, 'dataSource');
  return (
    <div className='mapicon-root'>
      <div className='mapicon-img' data-item={JSON.stringify(dataSource)}>
<<<<<<< HEAD
        <img src={getIconUrl(dataSource)} width={18} />
=======
        <img
          src={dataSource.deviceType === 1 ? icon1Url : icon2Url}
          width={30}
        />
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
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
<<<<<<< HEAD
              borderTop: 'none',
            }}>
            <div style={{ height: 160 }} className='mapicon-video' />
            {/* <ReactHlsPlayer
=======
              backgroundColor: 'transparent',
              borderTop: 'none',
            }}>
            <ReactHlsPlayer
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
              src='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
              autoPlay={true}
              controls={true}
              width='100%'
              height={160}
<<<<<<< HEAD
            /> */}
=======
            />
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
          </div>
        )}
      </div>
    </div>
  );
}
