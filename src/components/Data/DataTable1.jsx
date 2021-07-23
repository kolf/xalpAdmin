import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Pagination,
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

  const { data, run, loading } = useRequest(
    () =>
      dataService.getAreaTopProvince({
        ...makeQuery(query),
        maxResultCount: 1000,
      }),
    {
      initialData: [],
      onSuccess(res) {
        setProvince(res[0].sourceProvince);
      },
    }
  );

  const { data: areaData, loading: areaLoading } = useRequest(
    () =>
      dataService.getOrderAreaList({
        ...makeQuery(query),
        maxResultCount: 1000,
        keyword: province,
      }),
    {
      // manual: true,
      debounceInterval: 600,
      initialData: {
        items: [],
      },
      onSuccess(res) {
        setCity(res.items[0].sourceCity);
      },
      refreshDeps: [province],
      ready: province,
    }
  );

  const { data: cityData, loading: cityLoading } = useRequest(
    () =>
      dataService.getOrderCityList({
        ...makeQuery(query),
        cityName: city,
        keyword: undefined,
        maxResultCount: undefined,
        skipCount: undefined,
      }),
    {
      debounceInterval: 600,
      throwOnError: true,
      initialData: {
        items: [],
      },
      refreshDeps: [city],
      ready: city,
    }
  );

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
            disabled={data.length === 0}
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
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
          />
        </Form.Item>
      </Form>
      <div className="panel-title">全国排行</div>
      <div style={{ height: 320 }}>
        {chartWidth && data.length > 0 && (
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
        )}
      </div>

      {areaData && areaData.items.length > 0 && (
        <div>
          <div className="panel-title">{province}排行</div>
          <div style={{ paddingBottom: 12, height: 320 }}>
            <Chart
              dataSource={areaData.items.map((item) => ({
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
      {cityData && cityData.items.length > 0 && (
        <div>
          <div className="panel-title">{city}排行</div>
          <div style={{ paddingBottom: 12, height: 320 }}>
            <Chart
              dataSource={cityData.items.map((item) => ({
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
