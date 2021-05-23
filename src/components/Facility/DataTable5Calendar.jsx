import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import faciliyService from "../../services/faciliy.service";
const dataFormat = "YYYY-MM-DD";

export default function DataTable5ListCalendar() {
  const [dataList, setDataList] = useState([]);

  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    loadData({});
  }, []);

  async function loadData(newQuery) {
    const nextQuery = { ...query, ...newQuery };
    setQuery(nextQuery);
    try {
      const { items, totalCount } =
        await faciliyService.getReservationTimeRangeList(makeQuery(nextQuery));
      setDataList(items);
    } catch (error) {}
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.startPermissionDate = start.format(dataFormat) + " 00:00:00";
        result.endPermissionDate = end.format(dataFormat) + " 23:59:59";
      } else if (value && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function dateFullCellRender(e) {
    const data = e.date();
    console.log(e.date(), "value");
    return (
      <div className="calendar-cell">
        <div className="calendar-cell-value">1000</div>
      </div>
    );
  }

  function monthFullCellRender(e) {
    return (
      <div className="calendar-cell">
        <div className="calendar-cell-value">{e.month() + 1}月</div>
      </div>
    );
  }

  return (
    <div className="calendar-root">
      <Calendar
        style={{ backgroundColor: "transparent" }}
        dateFullCellRender={dateFullCellRender}
        monthFullCellRender={monthFullCellRender}
      />
    </div>
  );
}
