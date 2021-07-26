import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Empty,
  message,
} from "antd";
import Chart from "./DataTable1Chart";
import moment from "moment";
import { useRequest } from "ahooks";
import modal from "../../shared/modal";
import dataService from "../../services/data.service";
const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";

export default React.memo(function DataTable() {
  const [form] = Form.useForm();
  const [chartWidth, setChartWidth] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "1000",
    keyword: "",
    date: [moment().startOf("month"), moment()],
  });
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const {
    data,
    run,
    loading,
    mutate: setData,
  } = useRequest(
    () =>
      dataService.getAreaTopProvince({
        ...makeQuery(query),
        maxResultCount: 1000,
      }),
    {
      initialData: [],
      onSuccess(res) {
        if (res.length > 0) {
          setProvince(res[0].sourceProvince);
        }
      },
      refreshDeps: [query],
    }
  );

  const {
    data: areaData,
    loading: areaLoading,
    mutate: setAreaData,
  } = useRequest(
    () =>
      dataService.getOrderAreaList({
        ...makeQuery(query),
        maxResultCount: 1000,
        keyword: province,
      }),
    {
      // manual: true,
      debounceInterval: 600,
      initialData: [],
      onSuccess(res) {
        if (res.length > 0) {
          setCity(res[0].sourceCity);
        }
      },
      refreshDeps: [province, query],
      ready: province,
    }
  );

  const {
    data: cityData,
    loading: cityLoading,
    mutate: setCityData,
  } = useRequest(
    () =>
      dataService.getOrderCityList({
        ...makeQuery(query),
        cityName: city,
        keyword: province,
        maxResultCount: undefined,
        skipCount: undefined,
      }),
    {
      debounceInterval: 600,
      throwOnError: true,
      initialData: [],
      refreshDeps: [city, province, query],
      ready: city,
    }
  );

  useEffect(() => {
    setData([]);
    setAreaData([]);
    setCityData([]);
    setProvince("");
  }, [query]);

  useEffect(() => {
    setCity("");
  }, [province]);

  useEffect(() => {
    if (!chartWidth) {
      setChartWidth(window.innerWidth - 600);
    }
  }, [window.innerWidth]);

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (key === "date" && value) {
        const [start, end] = value;
        result.startDate = start.format(dateFormat) + " 00:00:00";
        result.endDate = end.format(dateFormat) + " 23:59:59";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  async function openFile() {
    try {
      const res1 = await dataService.exportAreaList(makeQuery(query));
      window.open(res1);
    } catch (error) {
      message.error(`导出失败！`);
    }
  }

  return (
    <div>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto"></Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Button
            size="small"
            type="primary"
            onClick={openFile}
            disabled={!data || data.length === 0}
          >
            下载数据
          </Button>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
        initialValues={query}
      >
        <Form.Item name="date">
          <RangePicker size="small" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
      </Form>
      {data.length === 0 && !loading && (
        <div style={{ paddingTop: 48 }}>
          <Empty />
        </div>
      )}
      {data.length > 0 && (
        <div>
          <div className="panel-title">全国排行</div>
          <div style={{ height: 320 }}>
            <Chart
              dataSource={data.map((item) => ({
                label: item.sourceProvince,
                value: item.ticketCount,
                rate: item.rate * 100,
              }))}
              id="province"
              width={chartWidth}
              onClick={(e) => setProvince(e.label)}
            />
          </div>
        </div>
      )}

      {areaData.length > 0 && (
        <div>
          <div className="panel-title">{province}排行</div>
          <div style={{ paddingBottom: 12, height: 320 }}>
            <Chart
              dataSource={areaData.map((item) => ({
                label: item.sourceCity,
                value: item.ticketCount,
                rate: item.rate * 100,
              }))}
              id="area"
              width={chartWidth}
              onClick={(e) => setCity(e.label)}
            />
          </div>
        </div>
      )}
      {cityData.length > 0 && (
        <div>
          <div className="panel-title">{city}排行</div>
          <div style={{ paddingBottom: 12, height: 320 }}>
            <Chart
              dataSource={cityData.map((item) => ({
                label: item.sourceCityArea,
                value: item.ticketCount,
                rate: item.rate * 100,
              }))}
              id="city"
              width={chartWidth}
            />
          </div>
        </div>
      )}
    </div>
  );
});
