import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./Main.less";

export default function Main({ header, children, onClose }) {
  const [height, setHeight] = useState(640);
  useEffect(() => {
    const windowHeight = window.innerHeight;
    setHeight(windowHeight - 178-120);
  });
  return (
    <div className="main-root">
      <div onClick={onClose} className="main-close">
        <CloseOutlined
          style={{ fontSize: 12, position: "relative", top: "-2px" }}
        />
      </div>
      {header && header}
      <div className="main-body" style={{ maxHeight: height }}>{children}</div>
    </div>
  );
}
