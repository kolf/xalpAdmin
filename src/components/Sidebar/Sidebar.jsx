import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressArc from "../UI/ProgressArc";
import DeviceTotal from "./DeviceTotal";
import AdmissionChart from "./AdmissionChart";
import TouristChart from "./TouristChart";
import dataService from "../../services/data.service";
import utils from "../../shared/utils";
import "./Sidebar.less";
import headerImageUrl from "../../assets/img/header1.png";

export default function Sidebar() {
  const [height, setHeight] = useState(640);
  const [orderRealTimeData, setOrderRealTimeData] = useState({
    todayTicketCount: 0,
    todayUsedTicketCount: 0,
    quarterTicketCount: 0,
    quarterUsedTicketCount: 0,
  });

  useEffect(async () => {
    const windowHeight = window.innerHeight;
    setHeight(windowHeight - 102);
    loadData();

    async function loadData() {
      const res1 = await dataService.getOrderRealTimeStatistics();
      setOrderRealTimeData(res1);
    }
  }, [window.innerHeight]);

  return (
    <div className="sidebar-root" style={{ maxHeight: height }}>
      <div className="sidebar-heading">
        <span style={{ backgroundImage: "url(" + headerImageUrl + ")" }}>
          入园管理
        </span>
        <div
          style={{
            flex: 1,
            paddingLeft: 12,
            marginTop: -4,
            textAlign: "center",
          }}
        >
          <DeviceTotal />
        </div>
      </div>
      <div className="panel-heading">入园概览</div>
      <div className="panel-body">
        <ProgressArc
          dataSource={[
            {
              key: "todayTicketCount",
              value: utils.numberFixed(orderRealTimeData.todayTicketCount),
              prefix: orderRealTimeData.todayTicketCount > 9999 ? "万人" : "人",
              title: (
                <>
                  <div>今日预约</div><div>人数</div>
                </>
              ),
            },
            {
              key: "todayUsedTicketCount",
              value: utils.numberFixed(orderRealTimeData.todayUsedTicketCount),
              prefix:
                orderRealTimeData.todayUsedTicketCount > 9999 ? "万人" : "人",
              title: (
                <>
                  <div>今日已核销</div>
                  <div>人数</div>
                </>
              ),
            },
            {
              key: "quarterTicketCount",
              value: utils.numberFixed(orderRealTimeData.quarterTicketCount),
              prefix:
                orderRealTimeData.quarterTicketCount > 9999 ? "万人" : "人",
              title: (
                <>
                  <div>当季预约</div>
                  <div>人数</div>
                </>
              ),
            },
            {
              key: "quarterUsedTicketCount",
              value: utils.numberFixed(
                orderRealTimeData.quarterUsedTicketCount
              ),
              prefix:
                orderRealTimeData.quarterUsedTicketCount > 9999 ? "万人" : "人",
              title: (
                <>
                  <div>当季已核销</div>
                  <div>人数</div>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="panel-heading">入园数据</div>
      <div className="panel-body">
        <AdmissionChart />
      </div>
      <div className="panel-heading">当月游客分析</div>
      <div className="panel-body">
        <TouristChart />
      </div>
      <div className="panel-footer" style={{ marginTop: 0 }}>
        <Link to="/data" style={{ marginLeft: "auto" }}>
          查看更多
        </Link>
      </div>
    </div>
  );
}
