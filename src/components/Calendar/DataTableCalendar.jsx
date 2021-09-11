import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, Space, Spin, Row, Col, Button } from 'antd';
import {
  LeftOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
} from '@ant-design/icons';
import DataTableCalendarDetails from './DataTableCalendarDetails';
import UpdateDataForm from './DataTableUpdateTabs';
<<<<<<< HEAD
import { useRequest } from 'ahooks';
import modal from '../../shared/modal';
import faciliyService from '../../services/faciliy.service';
import sessionService from '../../services/session.service';
=======
import modal from '../../shared/modal';
import faciliyService from '../../services/faciliy.service';
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
const monthFormat = 'YYYY-MM';
const dateFormat = 'YYYY-MM-DD';
const currentMoment = moment();

export default function DataTableListCalendar({ renderHeader }) {
<<<<<<< HEAD
  const roles = sessionService.getUserRoles();
  const [selectedDate, setSelectedDate] = useState('');
=======
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [dataList, setDataList] = useState([]);
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
  const [monthDate, setMonthDate] = useState(currentMoment.format(monthFormat));

<<<<<<< HEAD
  const {
    refresh,
    data = [],
    loading,
  } = useRequest(
    async () => {
      const { items } = await faciliyService.getReservationTimeRangeList(
        makeQuery(monthDate),
      );
      return items || [];
    },
    {
      refreshDeps: [monthDate],
    },
  );
=======
  useEffect(() => {
    let mounted = true;
    loadData();

    async function loadData() {
      setLoading(true);
      try {
        const { items } = await faciliyService.getReservationTimeRangeList(
          makeQuery(monthDate),
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
  }, [monthDate, counter]);
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb

  function makeQuery(date) {
    const currentDate = moment(date).startOf('month');
    const startTime = currentDate.date(-currentDate.day() + 1);

    return {
      StartTime: startTime.format(dateFormat),
      EndTime: startTime.add(6, 'w').format(dateFormat),
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
      refresh();
    }
  }

  function getDayData(date) {
    return data.find((item) => item.reserveDatePlain === date);
  }

  function dateFullCellRender(e) {
    let current = null;
    const currentDate = e.format(dateFormat);
    if (data.length > 0) {
      current = getDayData(currentDate);
    }
    const date = e.date();
    let isSpecial = false;
    let isWraning = false;
    if (current && current.timeRanges) {
      isSpecial = current.timeRanges.some((item) => item.isSpecial);
      isWraning = current.timeRanges.some((item) => {
        const max =
          item.groupWarningLeftQuantity || item.individualWarningLeftQuantity;
        const number =
          item.groupRemainTouristsQuantity +
          item.individualRemainTouristsQuantity;
        return number < max;
      });
    }

    return (
      <div
        className='calendar-cell'
        onClick={() => setSelectedDate(currentDate)}>
        <div className='calendar-cell-title'>{date}日</div>
        <div className='calendar-cell-notice'>
          {current &&
            (current.timeRanges || [])
              .filter((item, index) => index < 3)
              .map((time, j) => {
                return (
                  <div
                    key={time.reserveDate + time.timeItemId + '-' + j}
                    style={{
                      height: 18,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                    title={`${time.startTimeRange}-${time.endTimeRange} ${time.remainTouristsQuantity}/${time.maxTouristsQuantity}`}>
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
          className='calendar-cell-value'
          style={{ color: getValueColor(isSpecial, isWraning) }}>
          {current
            ? (current.timeRanges || []).reduce((result, item) => {
                return (result += item.maxTouristsQuantity);
              }, 0)
            : '0'}
        </div>
      </div>
    );
  }

  function getValueColor(isSpecial, isWraning) {
    if (isSpecial) {
      return '#ffe58f';
    }
    if (isWraning) {
      return '#b74635';
    }
    return '#fff';
  }

  function headerRender({ value, onChange }) {
    const month = value.month();
    const year = value.year();
    return (
      <div className='calendar-heading'>
        <Button
          icon={<DoubleLeftOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.year(year - 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
<<<<<<< HEAD
          }}
        />
=======
          }}></Button>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
        <Button
          icon={<LeftOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.month(month - 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
<<<<<<< HEAD
          }}
        />
=======
          }}></Button>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
        <span style={{ height: 32, lineHeight: '32px', padding: '0 24px' }}>
          {monthDate}
        </span>
        <Button
          icon={<RightOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.month(month + 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
<<<<<<< HEAD
          }}
        />
=======
          }}></Button>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
        <Button
          icon={<DoubleRightOutlined />}
          onClick={(e) => {
            const nextValue = value.clone();
            nextValue.year(year + 1);
            onChange(nextValue);
            setMonthDate(nextValue.format(monthFormat));
<<<<<<< HEAD
          }}
        />
=======
          }}></Button>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
      </div>
    );
  }

  return (
    <div className='calendar-root'>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex='auto'>{renderHeader}</Col>
        <Col flex='120px' style={{ textAlign: 'right' }}>
          <Space>
<<<<<<< HEAD
            {/SmartTicketingReservation.TimeRangeSettings.Create/.test(
              roles,
            ) && (
              <Button size='small' type='primary' onClick={showAddModal}>
                批量上票
              </Button>
            )}
=======
            <Button size='small' type='primary' onClick={showAddModal}>
              批量上票
            </Button>
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
          </Space>
        </Col>
      </Row>
      {selectedDate ? (
        <DataTableCalendarDetails
          id={selectedDate}
          dataSource={getDayData(selectedDate)}
          onClose={(e) => {
<<<<<<< HEAD
            refresh();
=======
            setCounter(counter + 1);
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
            setSelectedDate('');
          }}
        />
      ) : (
        <Spin tip='加载中...' spinning={loading}>
          <Calendar
            style={{ backgroundColor: 'transparent' }}
            dateFullCellRender={dateFullCellRender}
            headerRender={headerRender}
            onPanelChange={handleChange}
          />
        </Spin>
      )}
    </div>
  );
}
