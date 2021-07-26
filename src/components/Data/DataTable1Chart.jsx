import React, { useEffect, useRef } from "react";
import F2 from "@antv/f2/dist/f2-all.js";

function getLabels(data) {
  return data.filter((item, index) => index < 12).map((item) => item.label);
}

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
        value: {},
        label: {
          tickCount: 12,
          values: getLabels(dataSource),
        },
      });

      chart.interval().position("label*value");
      chart.interaction("pan");
      // 定义进度条
      chart.scrollBar({
        mode: "x",
        xStyle: {
          backgroundColor: "#808080",
          fillerColor: "rgb(39 255 212 / 80%)",
          offsetY: -2,
        },
      }); // 绘制柱状图文本
      dataSource.forEach(function (obj) {
        chart.guide().text({
          position: [obj.label, obj.value, obj.rate],
          content: (obj.rate ? obj.rate.toFixed(2) : 0) + "%",
          offsetY: -10,
        });
        chart.guide().text({
          position: [obj.label, obj.value, obj.rate],
          content: obj.value + "人",
          offsetY: -26,
        });
      });
      chart.render();

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
            console.log(e.data, "e.data");
            e.data && onClick(e.data);
          },
        });
      }
    }
  }, [JSON.stringify(dataSource), id]);

  return <canvas id={id} width={width || 600} height="320"></canvas>;
});
