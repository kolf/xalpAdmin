import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Space,
  Select,
  Pagination,
  TimePicker,
  message,
} from "antd";
import modal from "../../shared/modal";
import faciliyService from "../../services/faciliy.service";
import { reviewOptions } from "../../shared/options";
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm";

const createId = () => {
  return Date.now();
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请选择`,
            },
          ]}
        >
          <TimePicker format={timeFormat} style={{ width: 96 }} size="small" />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [editingKey, setEditingKey] = useState("");

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
    setLoading(true);
    try {
      const { items } = await faciliyService.getReservationTimeItemOptions(
        makeQuery(nextQuery)
      );
      setLoading(false);
      setDataList(
        items.map((item) => {
          const [startTime, endTime] = item.displayText.split("-");
          return { ...item, startTime, endTime, key: item.id };
        })
      );
    } catch (error) {
      setLoading(false);
    }
  }

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.filter((item, index) => index < 3);
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      result[key] = value;
      return result;
    }, {});
  }

  async function onDelete(creds) {
    const res = await faciliyService.deleteReservationTimeItem({
      ...creds,
      startTime: undefined,
      endTime: undefined,
      key: undefined,
    });
    message.success(`删除成功！`);
    const nextDataList = dataList.filter((item) => item.key !== creds.key);
    setDataList(nextDataList);
  }

  async function onSave(key) {
    try {
      const row = await form.validateFields();
      const [startTime, endTime] = [
        row.startTime.format(timeFormat),
        row.endTime.format(timeFormat),
      ];

      const displayText = startTime + "-" + endTime;
      let res = null;
      if (/^\d+$/) {
        res = await create({ key, startTime, endTime, displayText });
      } else {
        res = await update({ key, startTime, endTime, displayText });
      }

      const nextDataList = dataList.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            startTime,
            endTime,
            displayText,
          };
        }
        return item;
      });
      setDataList(nextDataList);
      setEditingKey("");
    } catch (error) {
      console.error(error, "error");
    }
  }

  async function update({ key, startTime, endTime, displayText }) {
    try {
      const res = await faciliyService.updateReservationTimeItem({
        timeRangeName: displayText,
        startTimeRange: startTime,
        endTimeRange: endTime,
        maxTouristsQuantity: 0,
        id: key,
      });
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function create({ key, startTime, endTime, displayText }) {
    try {
      const res = await faciliyService.addReservationTimeItem({
        timeRangeName: displayText,
        startTimeRange: startTime,
        endTimeRange: endTime,
        maxTouristsQuantity: 0,
        id: key,
      });
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function onEdit(record) {
    form.setFieldsValue({
      startTime: "",
      endTime: "",
      ...record,
    });
    setEditingKey(record);
  }

  function onAdd() {
    if (dataList.length >= 3) {
      return;
    }
    const id = createId();
    const nextDataList = [
      ...dataList,
      {
        id,
        key: id,
        displayText: "",
        startTime: "",
        endTime: "",
      },
    ];
    setDataList(nextDataList);
  }

  function isEditing(record) {
    return record.key === editingKey;
  }

  const columns = [
    {
      title: "时段名称",
      dataIndex: "displayText",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      editable: true,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "options",
      fixed: "right",
      width: 120,
      render(text, creds) {
        const editable = isEditing(creds);
        return (
          <div className="text-center">
            {editable ? (
              <Button
                size="small"
                style={{ marginRight: 4 }}
                onClick={onSave.bind(this, creds.key)}
              >
                保存
              </Button>
            ) : (
              <Button
                size="small"
                style={{ marginRight: 4 }}
                onClick={onEdit.bind(this, creds.key)}
                disabled={editingKey !== ""}
              >
                编辑
              </Button>
            )}
            <Button size="small" onClick={onDelete.bind(this, creds)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <div style={{ paddingBottom: 12 }}>
        <Button type="primary" size="small" onClick={onAdd}>
          添加时段
        </Button>
      </div>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={makeData(dataList)}
          columns={columns}
          pagination={false}
          size="small"
          bordered
          loading={loading}
          rowKey="id"
        />
      </Form>
    </>
  );
}
