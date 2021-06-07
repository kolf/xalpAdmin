import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar, Space, Spin, Row, Col, Button } from "antd";
import {
  LeftOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
} from "@ant-design/icons";
import DataTable5CalendarDetails from "./DataTable5CalendarDetails";
import UpdateDataForm from "./DataTable5UpdateTabs";
import modal from "../../shared/modal";
import faciliyService from "../../services/faciliy.service";
const dateFormat = "YYYY-MM-DD";
const currentMoment = moment();
function makeDate(date) {
  const currentDate = date.startOf('month');
  const startTime = currentDate.date(-currentDate.day() + 1);

  return [
    startTime.format(dateFormat),
    startTime.add(6, "w").format(dateFormat),
  ];
}

export default function DataTable5ListCalendar({ renderHeader }) {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [dataList, setDataList] = useState([]);
  const [monthDate, setMonthDate] = useState(currentMoment.format("YYYY-M"));

  useEffect(() => {
    const [StartTime, EndTime] = makeDate(moment(monthDate));
    loadData({ StartTime, EndTime });
  }, [monthDate]);

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

  function next(value) {
    let [year, month] = monthDate.split("-");

    if (value === "--1") {
      year = year - 1;
    } else if (value === "++1") {
      year = year * 1 + 1;
    } else if (value === "-1") {
      if (month === "1") {
        month = 12;
        year = year - 1;
      } else {
        month = month - 1;
      }
    } else if (value === "+1") {
      if (month === "12") {
        month = 1;
        year = year * 1 + 1;
      } else {
        month = month * 1 + 1;
      }
    }

    return year + "-" + month;
  }

  function todo(date) {
    const [year, month] = date.split("-");
    return year + "-" + (month < 10 ? "0" + month : month);
  }

  function handleChange(value) {
    const [StartTime, EndTime] = makeDate(value.add(1, "M"));
    loadData({ StartTime, EndTime });
  }

  function showAddModal() {
    const mod = modal({
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });
    function onOk() {
      mod.close();
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
    let isSpecial = false;
    if (current && current.timeRanges) {
      isSpecial = current.timeRanges.some((item) => item.isSpecial);
    }

    return (
      <div
        className="calendar-cell"
        onClick={() => setSelectedDate(currentDate)}
      >
        <div className="calendar-cell-title">{date}日</div>
        <div className="calendar-cell-notice">
          {current &&
            (current.timeRanges || [])
              .filter((item, index) => index < 3)
              .map((time) => {
                return (
                  <div
                    key={time.id}
                    style={{
                      height: 18,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    title={`${time.startTimeRange}-${time.endTimeRange} ${time.remainTouristsQuantity}/${time.maxTouristsQuantity}`}
                  >
                    <span style={{ paddingRight: 4 }}>
                      {time.startTimeRange}-{time.endTimeRange}
                    </span>
                    <span>
                      {time.groupRemainTouristsQuantity +
                        time.individualRemainTouristsQuantity}
                      /{time.maxTouristsQuantity}
                    </span>
                  </div>
                );
              })}
        </div>
        <div
          className="calendar-cell-value"
          style={isSpecial ? { color: "#ffe58f" } : null}
        >
          {current ? current.timeRanges[0].maxTouristsQuantity : "0"}
        </div>
      </div>
    );
  }

  function headerRender({ value, type, onChange, onTypeChange }) {
    return (
      <div className="calendar-heading">
        <Button
          icon={<DoubleLeftOutlined />}
          onClick={(e) => setMonthDate(next("--1"))}
        ></Button>
        <Button
          icon={<LeftOutlined />}
          onClick={(e) => setMonthDate(next("-1"))}
        ></Button>
        <span style={{ height: 32, lineHeight: "32px", padding: "0 24px" }}>
          {todo(monthDate)}
        </span>
        <Button
          icon={<RightOutlined />}
          onClick={(e) => setMonthDate(next("+1"))}
        ></Button>
        <Button
          icon={<DoubleRightOutlined />}
          onClick={(e) => setMonthDate(next("++1"))}
        ></Button>
      </div>
    );
  }

  return (
    <div className="calendar-root">
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto">{renderHeader}</Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={showAddModal}>
              批量上票
            </Button>
          </Space>
        </Col>
      </Row>
      {selectedDate ? (
        <DataTable5CalendarDetails
          id={selectedDate}
          dataSource={getDayData(selectedDate)}
          onClose={(e) => setSelectedDate("")}
        />
      ) : (
        <Spin tip="加载中..." spinning={loading}>
          <Calendar
            style={{ backgroundColor: "transparent" }}
            dateFullCellRender={dateFullCellRender}
            headerRender={headerRender}
            onPanelChange={handleChange}
          />
        </Spin>
      )}
    </div>
  );
}
