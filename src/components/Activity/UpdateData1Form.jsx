import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import UploadImage from "../../components/UI/UploadImage";
import UploadImageList from "../../components/UI/UploadImageList";
import UploadEditer from "../../components/UI/UploadEditer";
import utils from "../../shared/utils";
import activityService from "../../services/activity.service";
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const [blockBehaviorOptions, setBlockBehaviorOptions] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await activityService.getBlockAllowUserOptions();
      const options = res.items.map((item) => ({
        value: item.id,
        label: item.displayText,
      }));
      setBlockBehaviorOptions(options);
    } catch (error) {}
  }

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
              name="name"
              rules={[{ required: true, message: "请输入所属地址!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="活动起止日期"
              name="certNumber"
              rules={[{ required: true, message: "请选择活动起止日期!" }]}
            >
              <DatePicker size="small" />
            </Form.Item>

            <Form.Item
              label="举办地址"
              name="phone"
              rules={[{ required: true, message: "请输入举办地址!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="举办方"
              name="behaviorId"
              rules={[{ required: true, message: "请选择举办方!" }]}
            >
              <Select placeholder="请选择">
                {blockBehaviorOptions.map((o) => (
                  <Option value={o.value} key={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="报名名额"
              name="startTime"
              rules={[{ required: true, message: "请输入报名名额!" }]}
            >
              <Input placeholder="请输入" />
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
              name="certNumber"
              rules={[{ required: true, message: "选择报名起止日期!" }]}
            >
              <DatePicker size="small" />
            </Form.Item>

            <Form.Item
              label="经纬度"
              name="phone"
              rules={[{ required: true, message: "请输入经纬度!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="承办方"
              name="behaviorId"
              rules={[{ required: true, message: "请输入承办方!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="标签"
              name="startTime"
              rules={[{ required: true, message: "请输入标签!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="封面图"
              name="startTime"
              rules={[{ required: true, message: "请输入!" }]}
            >
              <UploadImage />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="图集"
              name="startTime"
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
              name="name"
              rules={[{ required: true, message: "请输入预约电话!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="报名人数"
              name="certNumber"
              rules={[{ required: true, message: "请输入报名人数!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="参与要求"
              name="name"
              rules={[{ required: true, message: "请输入姓名!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="是否上架"
              name="certNumber"
              rules={[{ required: true, message: "请输入身份证!" }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="活动介绍"
              name="startTime"
              rules={[{ required: true, message: "请输入!" }]}
            >
              <UploadEditer />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="其他说明"
              name="startTime"
              rules={[{ required: true, message: "请输入!" }]}
            >
              <UploadEditer />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
