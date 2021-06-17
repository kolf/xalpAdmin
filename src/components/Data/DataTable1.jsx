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
    maxResultCount: "10",
    keyword: "",
    date: [moment().startOf("month"), moment()],
  });
  const { data, run, loading } = useRequest(dataService.getAreaTopProvince, {
    manual: true,
    initialData: [],
  });
  const {
    data: areaData,
    run: fetchArea,
    loading: areaLoading,
  } = useRequest(dataService.getOrderAreaList, {
    debounceInterval: 600,
    manual: true,
    initialData: {
      items: [],
    },
  });

  useEffect(() => {
    console.log(query, "query");
    run(makeQuery(query)).then((res) => {
      if (res.length > 0) {
        // setAreaKeyword(res[0].sourceProvince);
        fetchArea({
          ...makeQuery(query),
          maxResultCount: 1000,
          keyword: res[0].sourceProvince,
        });
      }
    });
    if (!chartWidth) {
      setChartWidth(window.innerWidth - 600);
    }
  }, [JSON.stringify(query)]);

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
      const res = await dataService.exportAreaList(makeQuery(query));
      window.open(res);
    } catch (error) {}
  }

  function handleClick(data) {
    fetchArea({
      ...makeQuery(query),
      maxResultCount: 1000,
      keyword: data.label,
    });
  }

  return (
    <div>
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
      <div className="panel-title">省排行</div>
      <div style={{ height: 320 }}>
        {chartWidth && data.length > 0 && (
          <Chart
            dataSource={data.map((item) => ({
              label: item.sourceProvince,
              value: item.ticketCount,
            }))}
            id="province"
            width={chartWidth}
            onClick={handleClick}
          />
        )}
      </div>
      <div className="panel-title">市排行</div>
      <div style={{ paddingBottom: 12, height: 320 }}>
        {chartWidth && areaData.items.length > 0 && (
          <Chart
            dataSource={areaData.items.map((item) => ({
              label: item.sourceCity,
              value: item.ticketCount,
            }))}
            id="city"
            width={chartWidth}
          />
        )}
      </div>
    </div>
  );
});
