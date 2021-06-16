import React, { useState, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { Map, APILoader, Marker } from "@uiw/react-amap";
import MapIcon from "./MapIcon";
import imgUrl from "../../assets/img/cad-01.bb6c9874.png";
import update from "./alimapScript";
import "./AliMap.less";

const AliMap = () => {
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
              const marker1 = new AMap.Marker({
                position: [115.9436, 39.087134],
                content: renderToString(<MapIcon />),
                offset: new AMap.Pixel(-13, -30),
              });
              const marker2 = new AMap.Marker({
                position: [115.9416, 39.085134],
                content: renderToString(<MapIcon />),
                offset: new AMap.Pixel(-13, -30),
              });
              const marker3 = new AMap.Marker({
                position: [115.9446, 39.089134],
                content: renderToString(<MapIcon />),
                offset: new AMap.Pixel(-13, -30),
              });
              const markers = [marker, marker1, marker2, marker3];
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
