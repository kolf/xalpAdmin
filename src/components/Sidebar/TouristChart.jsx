import React, { useState, useEffect } from "react";
import F2 from "@antv/f2";

export default function TouristChart() {
  useEffect(() => {
    renderChart();
  });

  function renderChart() {
    const data = [
      {
        name: "股票类",
        percent: 83.59,
        a: "1",
      },
      {
        name: "债券类",
        percent: 2.17,
        a: "1",
      },
      {
        name: "现金类",
        percent: 14.24,
        a: "1",
      },
    ];

    const map = {};
    data.forEach(function (obj) {
      map[obj.name] = obj.percent + "%";
    });

    const chart = new F2.Chart({
      id: "chart1",
      pixelRatio: window.devicePixelRatio,
      padding: [0, "auto"],
    });
    chart.source(data, {
      percent: {
        formatter: function formatter(val) {
          return val + "%";
        },
      },
    });
    chart.tooltip(false);
    chart.legend({
      position: "right",
      itemFormatter: function itemFormatter(val) {
        return val + "    " + map[val];
      },
    });
    chart.coord("polar", {
      transposed: true,
      innerRadius: 0.7,
      radius: 0.85,
    });
    chart.axis(false);
    chart
      .interval()
      .position("a*percent")
      .color("name", ["#FE5D4D", "#3BA4FF", "#737DDE"])
      .adjust("stack");

    chart.guide().html({
      position: ["50%", "45%"],
      html: `<div style="width:120px;height: 40px;text-align: center;padding-top: 14px">
           年龄分布
          </div>`,
    });
    chart.render();
  }
  return <canvas id="chart1" width="352" height="160"></canvas>;
}