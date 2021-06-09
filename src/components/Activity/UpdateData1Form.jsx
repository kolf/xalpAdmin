import React, { useState, useEffect } from "react";
import moment from "moment";
import { Form, Input, Select, DatePicker, InputNumber, Row, Col } from "antd";
import UploadImage from "../../components/UI/UploadImage";
import UploadImageList from "../../components/UI/UploadImageList";
import UploadEditer from "../../components/UI/UploadEditer";
import AreaSelect from "../../components/UI/AreaSelect";
import utils from "../../shared/utils";
import activityService from "../../services/activity.service";
const { RangePicker } = DatePicker;

const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function UpdateDataForm({
  defaultValues = {},
  areaOptions,
  onOk,
}) {
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const res = await activityService.getBlockAllowUserOptions();
        const options = res.items.map((item) => ({
          value: item.id,
          label: item.displayText,
        }));
      } catch (error) {}
    }

    return () => {
      mounted = false;
    };
  }, []);

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await activityService.updateBlockAllowUser({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await activityService.addBlockAllowUser(makeParams(values));
        utils.success(`添加成功！`);
      } catch (error) {}
    }

    onOk && onOk(res);
  }

  function makeParams(values) {
    return Object.keys(values).reduce(
      (result, key) => {
        const value = values[key];
        if (key === "date" && value) {
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        userType: 1,
        certType: "身份证",
      }
    );
  }

  function makeDefaultValues() {
    const { id, name, certNumber, phone, behaviorId, startTime } =
      defaultValues;

    if (!id) {
      return {};
    }
    return {
      name,
      certNumber,
      phone,
      behaviorId,
      startTime: moment(startTime, dateFormat),
    };
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="所属地址"
              name="–address"
              rules={[{ required: true, message: "请输入所属地址!" }]}
            >
              <AreaSelect defaultOptions={areaOptions} />
            </Form.Item>

            <Form.Item
              label="活动起止日期"
              name="date1"
              rules={[{ required: true, message: "请选择活动起止日期!" }]}
            >
              <RangePicker
                size="small"
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
              />
            </Form.Item>

            <Form.Item
              label="举办地址"
              name="address1"
              rules={[{ required: true, message: "请输入举办地址!" }]}
            >
              <Input placeholder="请选择" />
            </Form.Item>
            <Form.Item
              label="举办方"
              name="-split1"
              rules={[{ required: true, message: "请输入举办方!" }]}
            >
              <Input placeholder="请选择" />
            </Form.Item>
            <Form.Item
              label="报名名额"
              name="maxApplyUserCount"
              rules={[{ required: true, message: "请输入报名名额!" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="活动名称"
              name="name"
              rules={[{ required: true, message: "请输入活动名称!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="报名起止日期"
              name="date2"
              rules={[{ required: true, message: "选择报名起止日期!" }]}
            >
              <RangePicker
                size="small"
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
              />
            </Form.Item>

            <Form.Item
              label="经纬度"
              name="tude"
              rules={[{ required: true, message: "请输入经纬度!" }]}
            >
              <Input placeholder="用逗号隔开，前面经度后面纬度" />
            </Form.Item>
            <Form.Item
              label="承办方"
              name="——behaviorId"
              rules={[{ required: true, message: "请输入承办方!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="标签"
              name="labels"
              rules={[{ required: true, message: "请输入标签!" }]}
            >
              <Input placeholder="多个标签以英文逗号隔开" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="封面图"
              name="tempCoverPicture"
              rules={[{ required: true, message: "请输入!" }]}
            >
              <UploadImage />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="图集"
              name="tempPictureItems"
              rules={[{ required: true, message: "请输入!" }]}
            >
              <UploadImageList />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="预约电话"
              name="servicePhone"
              rules={[{ required: true, message: "请输入预约电话!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="报名人数"
              name="maxUserCount"
              rules={[{ required: true, message: "请输入报名人数!" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="参与要求"
              name="qualificationGuidelines"
              rules={[{ required: true, message: "请输入姓名!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="是否上架"
              name="isActive"
              rules={[{ required: true, message: "请输入身份证!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label="活动介绍"
          name="description"
          rules={[{ required: true, message: "请输入!" }]}
        >
          <UploadEditer />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label="其他说明"
          name="note"
          rules={[{ required: true, message: "请输入!" }]}
          style={{
            paddingBottom: 0,
            marginBottom: 0,
            height: 192,
            overflow: "hidden",
          }}
        >
          <UploadEditer />
        </Form.Item>
      </Form>
    </>
  );
}
