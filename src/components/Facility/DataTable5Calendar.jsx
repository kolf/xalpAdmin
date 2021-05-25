import React, { useState, useEffect } from "react";
import { Calendar, Space, Spin, message } from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import faciliyService from "../../services/faciliy.service";
const dateFormat = "YYYY-MM-DD";

export default function DataTable5ListCalendar() {
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  let dayList = [];

  useEffect(() => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      loadData();
    }, 300);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { items } = await faciliyService.getReservationTimeRangeList(
        makeQuery()
      );
      setLoading(false);
      setDataList(items);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setDataList([]);
    }
  }

  function makeQuery() {
    const [StartTime, EndTime] = [
      dayList[0].format(dateFormat),
      dayList[dayList.length - 1].format(dateFormat),
    ];
    return {
      StartTime,
      EndTime,
    };
    // const [StartTime, EndTime] = [dayList[0].mo]
  }

  function handleChange(value) {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      loadData();
    }, 300);
    console.log(value, "");
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
    function onOk(done) {
      mod.close();
      loadData();
    }
  }

  function dateFullCellRender(e) {
    let current = null;
    if (dataList.length > 0) {
      dayList = [];
      current = dataList.find(
        (item) => item.reserveDatePlain === e.format(dateFormat)
      );
    } else {
      dayList.push(e);
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
              <div>
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
          onChange={handleChange}
        />
      </Spin>
    </div>
  );
}
