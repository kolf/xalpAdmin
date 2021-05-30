import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar, Space, Spin, message } from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import DataTable5CalendarDetails from "./DataTable5CalendarDetails";
import faciliyService from "../../services/faciliy.service";
const dateFormat = "YYYY-MM-DD";

function makeDate(date) {
  const currentDate = date.date(1);
  const startTime = currentDate.date(-currentDate.date(1).day() + 1);

  return [
    startTime.format(dateFormat),
    startTime.add(6, "w").format(dateFormat),
  ];
}

export default function DataTable5ListCalendar() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [dataList, setDataList] = useState([]);

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
    const [StartTime, EndTime] = makeDate(value.add(1, "M"));
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

  function getDayData(date) {
    return dataList.find((item) => item.reserveDatePlain === date);
  }

  function dateFullCellRender(e) {
    let current = null;
    const currentDate = e.format(dateFormat);
    if (dataList.length > 0) {
      current = getDayData(currentDate);
    }

    const date = e.date();
    return (
      <div
        className="calendar-cell"
        onClick={() => setSelectedDate(currentDate)}
      >
        <div className="calendar-cell-title">{date}日</div>
        <div className="calendar-cell-notice">
          {current &&
            (current.timeRanges || []).map((time) => (
              <div
                key={time.id}
                style={{ height: 18, overflow: "hidden", whiteSpace: "nowrap" }}
                title={`${time.startTimeRange}-${time.endTimeRange} ${time.remainTouristsQuantity}/${time.maxTouristsQuantity}`}
              >
                <span style={{ paddingRight: 4 }}>
                  {time.startTimeRange}-{time.endTimeRange}
                </span>
                <span>
                  {time.remainTouristsQuantity}/{time.maxTouristsQuantity}
                </span>
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

  if (selectedDate) {
    return (
      <DataTable5CalendarDetails
        id={selectedDate}
        dataSource={getDayData(selectedDate)}
      ></DataTable5CalendarDetails>
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
