import React, { useState, useEffect } from "react";
import F2 from "@antv/f2";
import { Spin } from "antd";
import moment from "moment";
import DataForm from "./DataForm";
import dataService from "../../services/data.service";
import utils from "../../shared/utils";
const dateFormat = "YYYY-MM-DD";
const colors = ["#32E9FF", "#1FFE9A"];

function makeDate(type, y, m, d) {
  let startDate = "";
  let endDate = "";
  if (type === "4") {
    startDate = moment(y).startOf("year").format(dateFormat) + " 00:00:00";
    endDate = moment(y).endOf("year").format(dateFormat) + " 23:59:59";
  } else if (type === "2") {
    startDate =
      moment()
        .set({ year: y, month: m - 1 })
        .startOf("month")
        .format(dateFormat) + " 00:00:00";
    endDate =
      moment()
        .set({ year: y, month: m - 1 })
        .endOf("month")
        .format(dateFormat) + " 23:59:59";
  } else if (type === "1") {
    startDate =
      moment()
        .set({ year: y, month: m - 1, date: d })
        .format(dateFormat) + " 00:00:00";
    endDate =
      moment()
        .set({ year: y, month: m - 1, date: d })
        .format(dateFormat) + " 23:59:59";
  }

  return {
    StartDateTime: startDate,
    EndDateTime: endDate,
  };
}

export default function AdmissionChart() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({});
  useEffect(() => {
    renderChart();
  });

  async function openFile() {
    const { TimeRangeType, CheckDeviceType } = query;
    let res1 = null;
    let res2 = null;
    try {
      if (query["year-1"]) {
        res1 = await dataService.exportCheckTimeRange({
          TimeRangeType,
          CheckDeviceType,
          ...makeDate(
            TimeRangeType,
            query["year-1"],
            query["month-1"],
            query["date-1"]
          ),
        });
        window.open(res1);
      }
      if (query["year-2"]) {
        res2 = await dataService.exportCheckTimeRange({
          TimeRangeType,
          CheckDeviceType,
          ...makeDate(
            TimeRangeType,
            query["year-2"],
            query["month-2"],
            query["date-2"]
          ),
        });
        window.open(res2);
      }

      console.log(res1, res2, "res");
    } catch (error) {
      utils.error(`下载失败！`);
    }
  }

  async function renderChart() {
    const { TimeRangeType, CheckDeviceType } = query;
    let data = [];
    let res1 = [];
    let res2 = [];
    try {
      if (query["year-1"]) {
        res1 = await dataService.getOrderCheckTimeRanges({
          TimeRangeType,
          CheckDeviceType,
          ...makeDate(
            TimeRangeType,
            query["year-1"],
            query["month-1"],
            query["date-1"]
          ),
        });
      }
      if (query["year-2"]) {
        res2 = await dataService.getOrderCheckTimeRanges({
          TimeRangeType,
          CheckDeviceType,
          ...makeDate(
            TimeRangeType,
            query["year-2"],
            query["month-2"],
            query["date-2"]
          ),
        });
      }

      data = [
        ...res1.map((item) => ({
          type: "数据1",
          value: item.personCount,
          date: item.checkTime,
        })),
        ...res2.map((item) => ({
          type: "数据2",
          value: item.personCount,
          date: item.checkTime,
        })),
      ];

      if (data.length === 0) {
        return;
      }

      const chart = new F2.Chart({
        id: "chart1",
        pixelRatio: window.devicePixelRatio,
      });
      chart.source(data, {
        date: {
          tickCount: 6,
          range: [0, 1],
        },
      });
      chart.legend(false);
      chart.axis("date", {
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = "left";
          } else if (index === total - 1) {
            textCfg.textAlign = "right";
          }
          return textCfg;
        },
      });
      chart.line().position("date*value").color("type", colors);
      chart.point().position("date*value").color("type", colors);
      chart.render();
    } catch (error) {}
  }

  return (
    <Spin spinning={loading}>
      <DataForm onChange={setQuery}></DataForm>
      <canvas id="chart1" width="352" height="160"></canvas>
      <div style={{ display: "flex", padding: "6px 6px 0 0" }}>
        <a
          href="javascript:;"
          style={{ marginLeft: "auto", marginTop: "-18px" }}
          onClick={openFile}
        >
          导出数据
        </a>
      </div>
    </Spin>
  );
}
