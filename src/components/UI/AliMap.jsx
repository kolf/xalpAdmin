import React, { useState, useEffect, useRef } from "react";
import { Map, APILoader, Marker } from "@uiw/react-amap";
import imgUrl from "../../assets/img/cad-01.bb6c9874.png";
import icon1Url from "../../assets/img/icon1.png";
export default function AliMap() {
  return (
    <div className="alimap-root">
      <APILoader akay="c54dd5d1143cb8ea800f1d5e8d48502a">
        <Map
          mapStyle="amap://styles/darkblue"
          center={[115.9425, 39.08746]}
          zoom={10}
          zooms={[16.5, 18]}
        >
          {({ AMap, map, container }) => {
            if (map) {
              const marker = new AMap.ImageLayer({
                bounds: new AMap.Bounds(
                  [115.927712, 39.098682],
                  [115.959986, 39.07465]
                ),
                zIndex: 2,
                url: imgUrl, // 图片 Url
                zooms: [10, 18], // 设置可见级别，[最小级别，最大级别]
              });
              marker.setMap(map);
            }
            return;
          }}
        </Map>
      </APILoader>
    </div>
  );
}
