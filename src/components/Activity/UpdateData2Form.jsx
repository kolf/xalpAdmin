import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Table, Row, Col, Space, Spin } from "antd";
import utils from "../../shared/utils";
import moment from "moment";
import { activityReviewOptions } from "../../shared/options";
import activityService from "../../services/activity.service";
const secFormat = "YYYY-MM-DD HH:mm:ss";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default function UpdateDataForm({ defaultValues = {}, saveRef }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [isApplySuccess, setIsApplySuccess] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    let mounted = true;
    loadData();

    if (mounted && saveRef) {
      saveRef(form);
    }

    async function loadData() {
      try {
        const res = await activityService.getActivityOrderDetails({
          id: defaultValues.id,
        });
        if (mounted) {
          setData({ ...res, ...res.activityOrder });
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "手机号",
      dataIndex: "phone",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "身份证号",
      dataIndex: "certNumber",
      render(text) {
        return text || "无";
      },
    },
  ];

  if (loading) {
    return (
      <Spin>
        <div className="loading-placeholder"></div>
      </Spin>
    );
  }

  return (
    <>
      <Row>
        <Col span={12}>
          <div className="pad-bottom">
            <Space>
              <span>订单号：</span>
              <span>{data.orderNO}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>提交时间：</span>
              <span>
                {data.creationTime
                  ? moment(data.creationTime).format(secFormat)
                  : "无"}
              </span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>团队名称：</span>
              <span>{data.groupName}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>手机号：</span>
              <span>{data.phone}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>备注：</span>
              <span>{data.note}</span>
            </Space>
          </div>
        </Col>
        <Col span={12}>
          <div className="pad-bottom">
            <Space>
              <span>订单状态：</span>
              <span>{data.orderStatus}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>活动名称：</span>
              <span>{data.activityName}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>团队负责人：</span>
              <span>{data.name}</span>
            </Space>
          </div>
          <div className="pad-bottom">
            <Space>
              <span>活动参与人数：</span>
              <span>{data.touristsCount}</span>
            </Space>
          </div>
        </Col>
      </Row>
      <div className="panel-title">人员信息</div>
      <Table
        pagination={false}
        size="small"
        bordered
        rowKey="tenantId"
        columns={columns}
        dataSource={data.detailItems}
        scroll={{ y: 240 }}
      />
      <div className="panel-title">订单审核</div>
      {saveRef ? (
        <Form {...layout} size="small" form={form}>
          <Form.Item
            label="审核"
            name="isApplySuccess"
            rules={[{ required: true, message: "请选择审核状态!" }]}
          >
            <Radio.Group
              onChange={(e) => {
                const vlaue = e.target.value;
                setIsApplySuccess(vlaue);
              }}
            >
              {activityReviewOptions.map((o) => (
                <Radio key={o.value} value={o.value}>
                  {o.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          {isApplySuccess === "2" && (
            <Form.Item
              label="不通过原因"
              name="reson"
              rules={[{ required: true, message: "请输入不通过原因!" }]}
            >
              <Input.TextArea rows="4" placeholder="请输入" />
            </Form.Item>
          )}
        </Form>
      ) : (
        <Row>
          <Col span={12}>
            <div className="pad-bottom">
              <Space>
                <span>审核人：</span>
                <span>{data.auditorName || "无"}</span>
              </Space>
            </div>
            <div className="pad-bottom">
              <Space>
                <span>审核结果：</span>
                <span>{data.stateName || "无"}</span>
              </Space>
            </div>
          </Col>
          <Col span={12}>
            <div className="pad-bottom">
              <Space>
                <span>审核时间：</span>
                <span>{data.auditTime || "无"}</span>
              </Space>
            </div>
            {data.refuseReason && (
              <div className="pad-bottom">
                <Space>
                  <span>不通过原因：</span>
                  <span>{data.refuseReason || "无"}</span>
                </Space>
              </div>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}
