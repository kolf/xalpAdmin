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
const monthFormat = "YYYY-MM";
const dateFormat = "YYYY-MM-DD";
const currentMoment = moment();

export default function DataTable5ListCalendar({ renderHeader }) {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [dataList, setDataList] = useState([]);
  const [monthDate, setMonthDate] = useState(currentMoment.format(monthFormat));

  useEffect(() => {
    let mounted = true;
    loadData();

    async function loadData() {
      setLoading(true);
      try {
        const { items } = await faciliyService.getReservationTimeRangeList(
          makeQuery(monthDate)
        );
        if (mounted) {
          setLoading(false);
          setDataList(items);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
          setDataList([]);
        }
      }
    }
    return () => {
      mounted = false;
    };
  }, [monthDate]);

  function makeQuery(date) {
    const currentDate = moment(date).startOf("month");
    const startTime = currentDate.date(-currentDate.day() + 1);

    return {
      StartTime: startTime.format(dateFormat),
      EndTime: startTime.add(6, "w").format(dateFormat),
    };
  }

  function handleChange(value) {
    const nextMonthDate = value.format(monthFormat);
    setMonthDate(nextMonthDate);
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
              .map((time, j) => {
                return (
                  <div
                    key={time.reserveDate + time.timeItemId + "-" + j}
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
          {current
            ? (current.timeRanges || []).reduce((result, item) => {
                return (result += item.maxTouristsQuantity);
              }, 0)
            : "0"}
        </div>
      </div>
    );
  }

  function headerRender({ value, onChange }) {
    const month = value.month();
    const year = value.year();
    return (
      <div className="calendar-heading">
        <Button
          icon={<DoubleLeftOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.year(year - 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
          }}
        ></Button>
        <Button
          icon={<LeftOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.month(month - 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
          }}
        ></Button>
        <span style={{ height: 32, lineHeight: "32px", padding: "0 24px" }}>
          {monthDate}
        </span>
        <Button
          icon={<RightOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.month(month + 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
          }}
        ></Button>
        <Button
          icon={<DoubleRightOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.year(year + 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
          }}
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
