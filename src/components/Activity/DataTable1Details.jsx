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

export default function DataTable1Details({ defaultValues = {}, saveRef, onOk }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
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

  function makeDefaultValues() {
    const { name, note, behaviorType, id } = defaultValues;
    if (!id) {
      return {};
    }
    return { name, note, behaviorType: behaviorType + "" };
  }

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "身份证号",
      dataIndex: "certNumber",
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
          <p>
            <Space>
              <span>订单号：</span>
              <span>{data.orderNO}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>提交时间：</span>
              <span>{data.applyTime}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>团队名称：</span>
              <span>{data.applyTime}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>手机号：</span>
              <span>{data.phone}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>备注：</span>
              <span>{data.note}</span>
            </Space>
          </p>
        </Col>
        <Col span={12}>
          <p>
            <Space>
              <span>订单状态：</span>
              <span>{data.orderStatus}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>活动名称：</span>
              <span>{data.orderStatus}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>团队负责人：</span>
              <span>{data.name}</span>
            </Space>
          </p>
          <p>
            <Space>
              <span>活动参与人数：</span>
              <span>{data.touristsCount}</span>
            </Space>
          </p>
        </Col>
      </Row>
      <div className="panel-title">人员信息</div>
      <Table
        pagination={false}
        size="small"
        bordered
        columns={columns}
        dataSource={data.detailItems}
        scroll={{ y: 240 }}
      />
      <div className="panel-title">订单审核</div>
      {saveRef ? (
        <Form {...layout} size="small" form={form}>
          <Form.Item label="审核" name="name">
            <Radio.Group>
              {activityReviewOptions.map((o) => (
                <Radio key={o.value} value={o.value}>
                  {o.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item label="不通过原因" name="note">
            <Input.TextArea rows="4" placeholder="请输入" />
          </Form.Item>
        </Form>
      ) : (
        <Row>
          <Col span={12}>
            <p>
              <Space>
                <span>审核人：</span>
                <span>{data.auditorName || "无"}</span>
              </Space>
            </p>
            <p>
              <Space>
                <span>审核结果：</span>
                <span>{data.stateName || "无"}</span>
              </Space>
            </p>
          </Col>
          <Col span={12}>
            <p>
              <Space>
                <span>审核时间：</span>
                <span>{data.auditTime || "无"}</span>
              </Space>
            </p>
            {data.refuseReason && (
              <p>
                <Space>
                  <span>不通过原因：</span>
                  <span>{data.refuseReason || "无"}</span>
                </Space>
              </p>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}
