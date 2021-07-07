import React, { useState, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { useRequest } from "ahooks";
import { Map, APILoader } from "@uiw/react-amap";
import policeService from "../../services/police.service";
import MapIcon from "./MapIcon";
import imgUrl from "../../assets/img/cad-01.5a2c39ae.png";
import update from "./alimapScript";

const AliMap = () => {
  const { data, loading, run } = useRequest(policeService.getDeviceMapList);
  if (loading) {
    return null;
  }
  return (
    <div className="alimap-root">
      <APILoader akay="c54dd5d1143cb8ea800f1d5e8d48502a">
        <Map
          mapStyle="amap://styles/darkblue"
          center={[115.9425, 39.08746]}
          zoom={17}
          zooms={[14.5, 18]}
        >
          {({ AMap, map, container }) => {
            if (map) {
              const marker = new AMap.ImageLayer({
                bounds: new AMap.Bounds(
                  [115.866331, 39.112493],
                  [115.959888, 39.067592]
                ),
                zIndex: 100,
                url: imgUrl, // 图片 Url
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
                        content: renderToString(
                          <MapIcon name={item.name} id={item.deviceId} />
                        ),
                        offset: new AMap.Pixel(-13, -30),
                      });
                    }
                  })
                  .filter((item) => item);
              }

              const markers = [marker, ...markerList];
              map.add(markers);
              update(AMap, map, markers);
            }
            return;
          }}
        </Map>
      </APILoader>
    </div>
  );
};

export default React.memo(AliMap);
