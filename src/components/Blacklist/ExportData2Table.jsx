import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Form, Space, Upload } from "antd";
import dataService from "../../services/data.service";
import sessionService from "../../services/session.service";
import utils from "../../shared/utils";
import { behaviorTypeEnum } from "../../shared/options";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default function DataTable({ id, onOk }) {
  const uersToken = sessionService.getUserToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [fileName, setFileName] = useState("");

  function makeData(data) {
    return data.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function openTemplateFile() {
    window.open(`${dataService.getTemplateFileUrl(3)}`);
  }

  async function onFinish() {
    try {
      const res = await dataService.importBlockBehavior({ fileName });
      utils.success(`导入成功！`);
    } catch (error) {}
    console.log("onFinish");
    onOk && onOk();
  }

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
    },
    {
      title: "程度",
      dataIndex: "behaviorType",
      render(text){
        return behaviorTypeEnum[text] || '无'
      }
    },
    {
      title: "行为",
      dataIndex: "name",
    },
    {
      title: "惩罚措施",
      dataIndex: "note",
    },
  ];

  const uploadProps = {
    name: "file",
    showUploadList: false,
    action: "api/BlockBehavior/Check",
    headers: {
      authorization: "Bearer " + uersToken,
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        try {
          setDataList(info.file.response.blockBehaviors);
          setFileName(info.file.response.tempExcelFileName);
        } catch (error) {
          utils.error(`文件格式有误！`);
        }
      } else if (info.file.status === "error") {
        utils.error(`${info.file.name} 上传失败！`);
      }
    },
  };

  return (
    <>
      <div style={{ paddingBottom: 12, marginTop: -12 }}>
        <Space>
          <Button size="small" type="primary" onClick={openTemplateFile}>
            模板下载
          </Button>
          <Upload {...uploadProps}>
            <Button size="small" type="primary">
              表格导入
            </Button>
          </Upload>
        </Space>
      </div>

      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
      />
      <div className="text-right" style={{ paddingTop: 12 }}>
        <Button size="small" type="primary" onClick={onFinish}>
          确定导入
        </Button>
      </div>
    </>
  );
}
