import React, { useState, useEffect } from "react";
import { Chart } from "@antv/g2";
import { Spin } from "antd";
import moment from "moment";
import { useRequest } from "ahooks";
import dataService from "../../services/data.service";
import utils from "../../shared/utils";
const dateFormat = "YYYY-MM-DD";

function makeDate() {
  const date = moment().format(dateFormat);
  return {
    StartDateTime: date + " 00:00:00",
    EndDateTime: date + " 23:59:59",
  };
}

export default function AdmissionChart() {
  const [query, setQuery] = useState({
    CheckDeviceType: 2,
    TimeRangeType: 1,
  });
  const { data, loading } = useRequest(
    () =>
      dataService.getOrderCheckTimeRanges({
        ...query,
        ...makeDate(),
      }),
    { initialData: [] }
  );

  console.log(data, "data");

  useEffect(() => {
    if (data.length > 0) {
      renderChart(data);
    }

    function renderChart(data) {
      const chart = new Chart({
        container: "chart1",
        autoFit: true,
        height: 160,
        padding: [20, 18, 20, 30],
      });

      chart.data(data);
      chart.scale({
        personCount: {
          alias: "入园人数",
          min: 1,
        },
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart
        .line()
        .position("checkTime*personCount")
        .color("#32E9FF")
        .shape("smooth");
      chart
        .point()
        .position("checkTime*personCount")
        .color("#32E9FF")
        .shape("circle");

      chart.render();
    }
  }, [data]);

  async function openFile() {
    try {
      const res = await dataService.exportCheckTimeRange({
        ...query,
        ...makeDate(),
      });
      window.open(res);
    } catch (error) {
      utils.error(`下载失败！`);
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ height: 180 }}>
        <div id="chart1"></div>
      </div>
      <div style={{ display: "flex", padding: "6px 6px 0 0" }}>
        <a
          style={{ marginLeft: "auto", marginTop: "-18px" }}
          onClick={openFile}
        >
          导出数据
        </a>
      </div>
    </Spin>
  );
}
