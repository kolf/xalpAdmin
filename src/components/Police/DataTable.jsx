import React, { useState, useEffect } from "react";
import { Table, Tabs, Button, Select, Row, Col, Form } from "antd";
import modal from "../../shared/modal";
import UpdateDataForm from "./UpdateDataForm";
import LogDataTable from "./LogDataTable";
const { TabPane } = Tabs;
const { Option } = Select;

export default function DataTable() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
  ];

  const columns = [
    {
      title: "设备IP",
      dataIndex: "name",
    },
    {
      title: "设备名称",
      dataIndex: "age",
    },
    {
      title: "设备类型",
      dataIndex: "address",
    },
    {
      title: "录入人姓名",
      dataIndex: "user",
    },
    {
      title: "录入人工号",
      dataIndex: "num",
    },
    {
      title: "录入人员电话",
      dataIndex: "phone",
    },
    {
      title: "在线状态",
      dataIndex: "online",
    },
    {
      title: "操作",
      dataIndex: "options",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={showLogModal.bind(this, creds)}
            >
              查看操作日志
            </Button>
            <Button size="small" onClick={showEditModal.bind(this, creds)}>
              编辑
            </Button>
          </div>
        );
      },
    },
  ];

  function onFinish(values) {
    console.log("Finish:", values);
  }

  function showLogModal(creds) {
    const mod = modal({
      title: "操作日志",
      content: <LogDataTable></LogDataTable>,
      onOk,
    });

    function onOk(values) {}
  }

  function showEditModal(creds) {
    const mod = modal({
      title: "编辑",
      content: <UpdateDataForm></UpdateDataForm>,
      onOk,
    });

    function onOk(values) {}
  }

  return (
    <div>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Select placeholder="系统菜单" size="small">
            <Option value="police">设备管理</Option>
            <Option value="facility">预约入园</Option>
            <Option value="blacklist">黑名单管理</Option>
            <Option value="user">权限管理</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Select placeholder="系统菜单" size="small">
            <Option value="police">设备管理</Option>
            <Option value="facility">预约入园</Option>
            <Option value="blacklist">黑名单管理</Option>
            <Option value="user">权限管理</Option>
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              size="small"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              查询数据
            </Button>
          )}
        </Form.Item>
      </Form>
      <Table dataSource={dataSource} columns={columns} size="small" bordered />
    </div>
  );
}
