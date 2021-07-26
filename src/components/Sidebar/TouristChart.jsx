import React, { useState, useEffect } from "react";
import { Row, Col, Progress } from "antd";
import F2 from "@antv/f2";
import { Spin } from "antd";
import moment from "moment";
import dataService from "../../services/data.service";
const dateFormat = "YYYY-MM-DD";
const startDate = moment().startOf("month").format(dateFormat) + " 00:00:00";
const endDate = moment().endOf("month").format(dateFormat) + " 23:59:59";
const defaultRes1 = [
  {
    value: 0,
    name: "河北省",
  },
  {
    value: 0,
    name: "河南省",
  },
  {
    value: 0,
    name: "北京市",
  },
];

function splitRate(data, item) {
  if (data.every((item) => !item.rate)) {
    return 1 / data.length;
  }
  return item.rate;
}

export default function TouristChart() {
  const [areaData, setAreaData] = useState(defaultRes1);

  useEffect(() => {
    let mounted = true;
    renderChart();

    async function renderChart() {
      let data = [];
      let res1 = [];
      let res2 = [];

      try {
        res1 = await dataService.getOrderAgeList({
          startDate,
          endDate,
        });

        res2 = await dataService.getAreaTopProvince({
          startDate,
          endDate,
        });

        if (!mounted) {
          return;
        }

        if (res2.length > 0) {
          setAreaData(
            res2
              .filter((item, index) => index < 3)
              .map((item) => ({
                ...item,
                value: item.ticketCount,
                name: item.sourceProvince || "无",
              }))
          );
        }

        data = res1
          .filter((item, index) => index < 5)
          .map((item) => ({
            name: item.ageRange,
            percent: item.rate,
            a: "1",
          }));

        const map = {};
        data.forEach(function (obj) {
          map[obj.name] = (obj.percent * 100).toFixed(2) + "%";
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
          .color("name", [
            "#1890FF",
            "#13C2C2",
            "#2FC25B",
            "#FACC14",
            "#F04864",
          ])
          .adjust("stack");

        chart.guide().html({
          position: ["50%", "45%"],
          html: `<div style="width:120px;height: 40px;text-align: center;padding-top: 14px">
         年龄分布
        </div>`,
        });
        chart.render();
      } catch (error) {}
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <canvas id="chart2" width="352" height="138"></canvas>
      {areaData.length > 0 && (
        <div style={{ height: 82, overflow: "hidden" }}>
          {areaData.map((item, index) => {
            return (
              <Row style={{ padding: "4px 0" }} key={"char2-" + index}>
                <Col span={4}>
                  <span
                    className="iconfont1"
                    style={{ fontSize: 18, lineHeight: 1.2 }}
                  >
                    TOP{index + 1}
                  </span>
                </Col>
                <Col span={3}>{item.name}</Col>
                <Col span={16}>
                  <Progress
                    percent={item.rate ? item.rate * 100 : 0}
                    strokeLinecap="square"
                    format={() => item.value}
                  />
                </Col>
              </Row>
            );
          })}
        </div>
      )}
    </>
  );
}
