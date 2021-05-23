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
const dataFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm";

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
          <TimePicker format={format}/>
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

  function onDelete(key) {}

  function onSave() {}

  function onEdit(record) {
    form.setFieldsValue({
      startTime: "",
      endTime: "",
      ...record,
    });
    setEditingKey(record);
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
      title: "开始时间",
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
              >
                编辑
              </Button>
            )}
            <Button size="small" onClick={onDelete.bind(this, creds.key)}>
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
        <Button type="primary" size="small">
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
