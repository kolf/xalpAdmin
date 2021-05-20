import React, { useState, useEffect } from "react";
import { Row, Col, Progress } from "antd";
import F2 from "@antv/f2";
import DataForm from "./DataForm";
import ProgressArc from "../UI/ProgressArc";
import "./Sidebar.less";

export default function Sidebar() {
  const [height, setHeight] = useState(640);
  const renderChart1 = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antfincdn/W50tXbofML/center-legend.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const chart = new F2.Chart({
          id: "chart1",
          pixelRatio: window.devicePixelRatio,
        });
        chart.source(data, {
          "School Year": {
            tickCount: 3,
          },
        });
        // 设置图例居中显示
        chart.legend({
          align: "center",
          itemWidth: null, // 图例项按照实际宽度渲染
        });
        // tooltip 与图例结合
        chart.tooltip({
          showCrosshairs: true,
        });
        chart
          .line()
          .position("School Year*value")
          .color("type")
          .style("type", {
            lineDash: function lineDash(val) {
              if (val === "Total") {
                return [1, 4];
              }
              return null;
            },
          });
        chart.point().position("School Year*value").color("type");
        chart.render();
      });
  };

  const renderChart2 = () => {
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
      id: "chart2",
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
  };

  useEffect(() => {
    const windowHeight = window.innerHeight;
    setHeight(windowHeight - 102);
    renderChart1();
    renderChart2();
  }, []);

  return (
    <div className="sidebar-root" style={{ maxHeight: height }}>
      <Row style={{ padding: "12px 0", marginLeft: "140px" }}>
        <Col span={8}>
          <div className="sidebar-heading-num">04</div>
          <div>设备总数</div>
        </Col>
        <Col span={8}>
          <div className="sidebar-heading-num">04</div>
          <div>在线设备</div>
        </Col>
        <Col span={8}>
          <div className="sidebar-heading-num">01</div>
          <div>离线设备</div>
        </Col>
      </Row>
      <div className="panel-heading">入园概览</div>
      <div className="panel-body">
        <ProgressArc
          dataSource={[
            {
              value: "34",
              prefix: "个",
              title: [<div>今日预约</div>, <div>人数</div>],
            },
            {
              value: "02",
              prefix: "个",
              title: [<div>今日已核销</div>, <div>人数</div>],
            },
            {
              value: "08",
              prefix: "个",
              title: [<div>当季预约</div>, <div>人数</div>],
            },
            {
              value: "12",
              prefix: "个",
              title: [<div>当季已核销</div>, <div>人数</div>],
            },
          ]}
        />
      </div>
      <div className="panel-heading">入园数据</div>
      <div className="panel-body">
        <DataForm />
        <canvas id="chart1" width="352" height="260"></canvas>
      </div>
      <div className="panel-heading">当月游客分析</div>
      <div className="panel-body">
        <canvas id="chart2" width="352" height="160"></canvas>
        <Row>
          <Col span={4}>TOP1</Col> <Col span={3}>湖北</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>TOP2</Col> <Col span={3}>湖北</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>TOP3</Col> <Col span={3}>湖北</Col>
          <Col span={16}>
            <Progress
              percent={30}
              strokeLinecap="square"
              format={() => "23651"}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
