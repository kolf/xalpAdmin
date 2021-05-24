import React, { useState, useEffect, useRef } from "react";
import { Calendar, Space, message } from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import faciliyService from "../../services/faciliy.service";
const dataFormat = "YYYY-MM-DD";

export default function DataTable5ListCalendar() {
  const calendarRef = useRef()
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    console.log(calendarRef, 'calendarRef')
    loadData({});
  }, []);

  async function loadData(newQuery) {
    const nextQuery = { ...query, ...newQuery };
    setQuery(nextQuery);
    setLoading(true);
    try {
      const { items } = await faciliyService.getReservationTimeSettingList(
        makeQuery(nextQuery)
      );
      setLoading(false);
      setDataList(items);
    } catch (error) {
      setLoading(false);
    }
  }

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.StartTime = start.format(dataFormat) + " 00:00:00";
        result.EndTime = end.format(dataFormat) + " 23:59:59";
      } else if (value && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function showEditModal(creds) {
    console.log(creds, "creds");
    const mod = modal({
      content: (
        <UpdateDataForm defaultValues={creds} onOk={onOk}></UpdateDataForm>
      ),
      footer: null,
    });
    function onOk(done) {
      mod.close();
      loadData({
        skipCount: "1",
      });
    }
  }

  function dateFullCellRender(e) {
    const date = e.date();
    return (
      <div className="calendar-cell" onClick={showEditModal.bind(this, e)}>
        <div className="calendar-cell-title">{date}日</div>
        <div className="calendar-cell-notice">
          <Space size="small">
            06:00-09:00<span className="text-danger">121</span>
          </Space>
          <div>09:00-12:00</div>
          <div>12:00-16:00</div>
        </div>
        <div className="calendar-cell-value">1000</div>
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
      <Calendar
        style={{ backgroundColor: "transparent" }}
        dateFullCellRender={dateFullCellRender}
        monthFullCellRender={monthFullCellRender}
        ref={calendarRef}
      />
    </div>
  );
}
