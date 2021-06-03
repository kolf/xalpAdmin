import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Skeleton } from "antd";
import UploadImage from "../UI/UploadImage";
import moment from "moment";
import utils from "../../shared/utils";
import faciliyService from "../../services/faciliy.service";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 14 },
};

export default function UpdateDataForm({ defaultValues = {}, onOk }) {
  const [merchantOptions, setMerchantOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (merchantOptions.length === 0) {
      loadData();
    }
  }, [JSON.stringify(setMerchantOptions)]);

  async function loadData() {
    try {
      const res = await faciliyService.getMerchantList({
        skipCount: "1",
        maxResultCount: "1000",
      });
      const { items } = res;

      setMerchantOptions(
        items.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function onFinish(values) {
    let res = null;
    if (defaultValues.id) {
      try {
        res = await faciliyService.updateStaff({
          ...makeParams(values),
          id: defaultValues.id,
        });
        utils.success(`更新成功！`);
      } catch (error) {}
    } else {
      try {
        res = await faciliyService.addStaff(makeParams(values));
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
          const [start, end] = value;
          result.startPermissionDate = start.format(dateFormat);
          result.endPermissionDate = end.format(dateFormat);
        } else if (key === "tempFaceFileName" && /^http/.test(value)) {
        } else if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        return result;
      },
      {
        staffType: 2,
      }
    );
  }

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    const {
      jobNumber,
      name,
      organizationUnit,
      phone,
      certNumber,
      tempFaceFileName,
      webUrl,
      startCardTime,
      endCardTime,
      merchantName,
    } = values;

    console.log(merchantName, merchantOptions, "merchantName");

    return {
      merchantId: (merchantOptions.find((o) => o.label === merchantName) || {})
        .value,
      jobNumber,
      name,
      organizationUnit,
      phone,
      certNumber,
      tempFaceFileName,
      tempFaceFileName: webUrl,
      date: [
        moment(startCardTime, dateFormat),
        moment(endCardTime, dateFormat),
      ],
    };
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      <Form
        {...layout}
        size="small"
        onFinish={onFinish}
        initialValues={makeDefaultValues(defaultValues)}
      >
        <Form.Item label="供应商" name="merchantId">
          <Select placeholder="请选择">
            {merchantOptions.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="工号" name="jobNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="岗位" name="organizationUnit">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="身份证号" name="certNumber">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="照片" name="tempFaceFileName">
          <UploadImage />
        </Form.Item>
        <Form.Item label="有效入园时间段" name="date">
          <RangePicker />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
