import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Input, Select } from "antd";
import policeService from "../../services/police.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default function DataTable({ id }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
  });

  useEffect(() => {
    loadData({});
  }, []);

  async function loadData(newQuery) {
    const nextQuery = { ...query, ...newQuery };
    setQuery(nextQuery);
    setLoading(true);
    try {
      const { items, totalCount } = await policeService.getDeviceLogList(
        makeQuery(nextQuery)
      );
      setLoading(false);
      setDataList(items);
      setTotal(totalCount);
    } catch (error) {
      setLoading(false);
    }
  }

  function makeData(data) {
    return data.map((item, index) => {
      return { ...item.device, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (key === "date" && value) {
          const [start, end] = value;
          result.StartTime = start.format(dateFormat) + " 00:00:00";
          result.EndTime = end.format(dateFormat) + " 23:59:59";
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        DeviceId: id,
      }
    );
  }

  const columns = [
    {
      title: "设备IP地址",
      dataIndex: "ipAddress",
    },
    {
      title: "操作时间",
      dataIndex: "interactionTime",
    },
    {
      title: "操作详情",
      dataIndex: "logContent",
    },
  ];

  const paginationProps = {
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total,
    position: ["", "bottomCenter"],
  };

  return (
    <div>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={loadData}
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

      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={paginationProps}
        size="small"
        bordered
        loading={loading}
      />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Tabs,
//   Button,
//   Select,
//   DatePicker,
//   Form,
//   Input,
//   Row,
//   Col,
// } from "antd";
// const { TabPane } = Tabs;
// const { RangePicker } = DatePicker;
// import policeService from "../../services/police.service";

// const { Option } = Select;
// const { Search } = Input;
// const dataSource = [
//   {
//     key: "1",
//     name: "胡彦斌",
//     age: 32,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "2",
//     name: "胡彦祖",
//     age: 42,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "1",
//     name: "胡彦斌",
//     age: 32,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "2",
//     name: "胡彦祖",
//     age: 42,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "1",
//     name: "胡彦斌",
//     age: 32,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "2",
//     name: "胡彦祖",
//     age: 42,
//     address: "西湖区湖底公园1号",
//   },
//   {
//     key: "1",
//     name: "胡彦斌",
//     age: 32,
//     address: "西湖区湖底公园1号",
//   },
// ];

// const columns = [
//   {
//     title: "设备IP地址",
//     dataIndex: "name",
//   },
//   {
//     title: "操作时间",
//     dataIndex: "age",
//   },
//   {
//     title: "操作详情",
//     dataIndex: "address",
//   },
// ];

// export default function LogDataTable() {
//   const [form] = Form.useForm();
//   const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

//   useEffect(() => {
//     forceUpdate({});
//   }, []);

//   const onFinish = (values) => {
//     console.log("Finish:", values);
//   };

//   return (
//     <>
//       <Form
//         form={form}
//         name="form"
//         layout="inline"
//         style={{ paddingBottom: 12 }}
//         onFinish={onFinish}
//       >
//         <Form.Item
//           name="username"
//           rules={[{ required: true, message: "Please input your username!" }]}
//         >
//           <RangePicker size="small" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" size="small">
//             查询数据
//           </Button>
//         </Form.Item>
//       </Form>

//       <Table dataSource={dataSource} columns={columns} size="small" bordered />
//     </>
//   );
// }
