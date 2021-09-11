import React, { useState, useEffect, useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { renderToString } from 'react-dom/server';
import { useRequest } from 'ahooks';
import { Map, APILoader } from '@uiw/react-amap';
import policeService from '../../services/police.service';
import MapIcon from './MapIcon';
import imgUrl from '../../assets/img/map.png';
import imgUrl2 from '../../assets/img/cad-02.395be9af.png';
import update from './alimapScript';

const AliMap = () => {
  const { data, loading, run } = useRequest(() =>
    policeService.getDeviceMapList({ userStatus: 0 }),
  );

  return (
    <div className='alimap-root'>
      <Map
        mapStyle='amap://styles/darkblue'
        center={[115.940771, 39.086931]}
        zoom={16.5}
        zooms={[14.5, 18]}>
        {({ AMap, map, container }) => {
          if (map) {
            const marker = new AMap.ImageLayer({
              bounds: new AMap.Bounds(
                [115.866331, 39.112493],
                [115.959888, 39.067592],
              ),
              zIndex: 100,
              url: imgUrl, // 图片 Url
              zooms: [10, 18], // 设置可见级别，[最小级别，最大级别]
            });
            const marker1 = new AMap.ImageLayer({
              bounds: new AMap.Bounds(
                [115.866331, 39.112493],
                [115.959888, 39.067592],
              ),
              zIndex: 101,
              url: imgUrl2, // 图片 Url
              zooms: [10, 18], // 设置可见级别，[最小级别，最大级别]
            });
            let markerList = [];
            if (data && data.length > 0) {
              markerList = data
                .map((item) => {
                  const { longitude, latitude } = item;
                  const position = [longitude * 1, latitude * 1];
                  if (latitude && longitude) {
                    return new AMap.Marker({
                      position,
                      topWhenClick: true,
                      content: renderToString(<MapIcon dataSource={item} />),
                      offset: new AMap.Pixel(-13, -30),
                    });
                  }
                })
                .filter((item) => item);
            }
<<<<<<< HEAD
=======
            if (map) {
              const marker = new AMap.ImageLayer({
                bounds: new AMap.Bounds(
                  [115.866331, 39.112493],
                  [115.959888, 39.067592],
                ),
                zIndex: 100,
                url: imgUrl, // 图片 Url
                zooms: [10, 18], // 设置可见级别，[最小级别，最大级别]
              });
              const marker1 = new AMap.ImageLayer({
                bounds: new AMap.Bounds(
                  [115.866331, 39.112493],
                  [115.959888, 39.067592],
                ),
                zIndex: 101,
                url: imgUrl2, // 图片 Url
                zooms: [10, 18], // 设置可见级别，[最小级别，最大级别]
              });
              let markerList = [];
              if (data && data.length > 0) {
                markerList = data
                  .map((item) => {
                    const { longitude, latitude } = item;
                    const position = [longitude * 1, latitude * 1];
                    if (latitude && longitude) {
                      return new AMap.Marker({
                        position,
                        topWhenClick: true,
                        content: renderToString(<MapIcon dataSource={item} />),
                        offset: new AMap.Pixel(-13, -30),
                      });
                    }
                  })
                  .filter((item) => item);
              }
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb

            const markers = [marker, marker1, ...markerList];
            map.add(markers);
            update(AMap, map, markers);
          }
          return;
        }}
      </Map>
    </div>
  );
};

export default React.memo(AliMap);
