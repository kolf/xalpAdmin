import React, { useEffect, useRef } from "react";
import F2 from "@antv/f2/dist/f2-all.js";

export default React.memo(function DataTable1Chart({
  id,
  width,
  dataSource,
  onClick,
}) {
  useEffect(() => {
    if (id) {
      renderChart(id);
    }

    function renderChart(id) {
      const chart = new F2.Chart({
        id,
        pixelRatio: window.devicePixelRatio,
      });

      chart.source(dataSource, {
        value: {
          tickCount: 5,
        },
      });
      chart.tooltip(false);
      chart.interval().position("label*value");
      chart.render();

      // 绘制柱状图文本
      const offset = -5;
      const canvas = chart.get("canvas");
      const group = canvas.addGroup();
      const shapes = {};
      dataSource.forEach(function (obj) {
        const point = chart.getPosition(obj);
        const text = group.addShape("text", {
          attrs: {
            x: point.x,
            y: point.y + offset,
            text: obj.value,
            textAlign: "center",
            textBaseline: "bottom",
            fill: "#808080",
          },
        });

        shapes[obj.label] = text; // 缓存该 shape, 便于后续查找
      });
      // 配置柱状图点击交互
      if (onClick) {
        chart.interaction("interval-select", {
          selectAxisStyle: {
            fill: "#fff",
            fontWeight: "bold",
          },
          mode: "range",
          defaultSelected: dataSource[0],
          onStart: function onProcess(e) {
            e.data && onClick(e.data);
          },
        });
      }
    }
  }, [JSON.stringify(dataSource), id]);

  return <canvas id={id} width={width || 600} height="320"></canvas>;
});
