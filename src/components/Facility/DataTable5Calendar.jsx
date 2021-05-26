import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar, Space, Spin, message } from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import faciliyService from "../../services/faciliy.service";
const dateFormat = "YYYY-MM-DD";

function makeDate(date) {
  const currentDate = date.date(1);
  console.log(
    date,
    currentDate.format(dateFormat),
    "currentDate"
  );
  const startTime = currentDate.date(-currentDate.date(1).day() + 1);

  return [
    startTime.format(dateFormat),
    startTime.add(6, "w").format(dateFormat),
  ];
}

export default function DataTable5ListCalendar() {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  let dayList = [];

  useEffect(() => {
    const [StartTime, EndTime] = makeDate(moment());
    loadData({ StartTime, EndTime });
  }, []);

  async function loadData(params) {
    setLoading(true);
    try {
      const { items } = await faciliyService.getReservationTimeRangeList(
        params
      );
      setLoading(false);
      setDataList(items);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setDataList([]);
    }
  }

  function handleChange(value) {
    console.log(value.format(dateFormat), "value");
    const [StartTime, EndTime] = makeDate(value.add(1,'M'));
    loadData({ StartTime, EndTime });
  }

  function showEditModal(creds) {
    if (!creds) {
      return;
    }
    const mod = modal({
      content: (
        <UpdateDataForm defaultValues={creds} onOk={onOk}></UpdateDataForm>
      ),
      footer: null,
    });
    function onOk() {
      mod.close();
      loadData();
    }
  }

  function dateFullCellRender(e) {
    let current = null;
    if (dataList.length > 0) {
      current = dataList.find(
        (item) => item.reserveDatePlain === e.format(dateFormat)
      );
    }

    const date = e.date();
    return (
      <div
        className="calendar-cell"
        onClick={showEditModal.bind(this, current)}
      >
        <div className="calendar-cell-title">{date}日</div>
        <div className="calendar-cell-notice">
          {current &&
            (current.timeRanges || []).map((time) => (
              <div key={time.id}>
                <Space size="small">
                  {time.startTimeRange}-{time.endTimeRange}
                  <span className="text-danger">{time.touristsCount}</span>
                </Space>
              </div>
            ))}
        </div>
        <div className="calendar-cell-value">
          {current ? current.timeRanges[0].maxTouristsQuantity : "0"}
        </div>
      </div>
    );
  }

  function monthFullCellRender(e) {
    return (
      <div className="calendar-cell">
        <div className="calendar-cell-title">{e.month() + 1}月</div>
        <div className="calendar-cell-year-value">1000</div>
      </div>
    );
  }

  return (
    <div className="calendar-root">
      <Spin tip="加载中..." spinning={loading}>
        <Calendar
          style={{ backgroundColor: "transparent" }}
          dateFullCellRender={dateFullCellRender}
          monthFullCellRender={monthFullCellRender}
          onPanelChange={handleChange}
        />
      </Spin>
    </div>
  );
}
