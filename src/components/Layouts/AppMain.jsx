import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./AppMain.less";

export default function Main({ header, children, onClose }) {
  const [height, setHeight] = useState(520);
  useEffect(() => {
    const windowHeight = window.innerHeight;
    setHeight(Math.max(windowHeight - 300, 520));
  });
  return (
    <div className="main-root">
      <div onClick={onClose} className="main-close">
        <CloseOutlined
          style={{ fontSize: 12, position: "relative", top: "-2px" }}
        />
      </div>
      {header && header}
      <div className="main-body" style={{ height }}>
        {children}
      </div>
    </div>
  );
}
