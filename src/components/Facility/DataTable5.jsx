import React, { useState, useEffect } from "react";
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
  Calendar,
  Radio,
  Pagination,
  message,
} from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./DataTable5UpdateTabs";
import DataTableCalendar from "./DataTable5Calendar";
import DataTableList from "./DataTable5List";

export default function DataTable() {
  const [showType, setShowType] = useState("1");

  function showAddModal() {
    const mod = modal({
      content: <UpdateDataForm onOk={onOk} />,
      footer: null,
    });
    function onOk() {
      mod.close();
    }
  }

  function openFile() {}

  return (
    <div>
      {showType === "2" && (
        <>
          <Row style={{ paddingBottom: 12 }}>
            <Col flex="auto">
              <Radio.Group
                value={showType}
                size="small"
                onChange={(e) => setShowType(e.target.value)}
              >
                <Radio.Button value="1">日历</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </Col>
            <Col flex="120px" style={{ textAlign: "right" }}>
              <Space>
                <Button size="small" type="primary" onClick={showAddModal}>
                  新增
                </Button>
                <Button size="small" type="primary" onClick={openFile}>
                  下载数据
                </Button>
              </Space>
            </Col>
          </Row>

          <DataTableList />
        </>
      )}
      {showType === "1" && (
        <>
          <Row style={{ paddingBottom: 12 }}>
            <Col flex="auto">
              <Radio.Group
                value={showType}
                size="small"
                onChange={(e) => setShowType(e.target.value)}
              >
                <Radio.Button value="1">日历</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </Col>
            <Col flex="120px" style={{ textAlign: "right" }}>
              <Space>
                <Button size="small" type="primary" onClick={showAddModal}>
                  批量上票
                </Button>
              </Space>
            </Col>
          </Row>
          <DataTableCalendar />
        </>
      )}
    </div>
  );
}
