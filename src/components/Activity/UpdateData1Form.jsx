import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, InputNumber, Row, Radio, Col } from 'antd';
import UploadImage from '../../components/UI/UploadImageUrl';
import UploadImageList from '../../components/UI/UploadImageList';
import UploadEditer from '../../components/UI/UploadEditer';
import AreaSelect from '../../components/UI/AreaSelect';
import InputGroup from '../../components/UI/InputGroup';
import { activityActiveOptions } from '../../shared/options';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default function UpdateDataForm({
  defaultValues = {},
  areaOptions,
  saveRef,
}) {
  const [form] = Form.useForm();
  const [defaultAreaOptions, setDefaultAreaOptions] = useState([
    ...areaOptions,
  ]);

  useEffect(() => {
    let mounted = true;

    if (mounted && saveRef) {
      saveRef(form);
      if (defaultValues.regionCityCode) {
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  function makeDefaultValues(values) {
    if (!values.id) {
      return {};
    }
    let result = Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === 'isActive') {
        result.isActive = value ? '1' : '0';
      } else if (key === 'pictureItems') {
        result.tempPictureItems = value.map((item, index) => ({
          uid: 'upload-' + index,
          status: 'done',
          thumbUrl: item,
          url: item,
        }));
      } else if (key === 'coverPicture') {
        result.tempCoverPicture = value;
      } else if (value !== undefined && value !== '-1') {
        result[key] = value;
      }
      return result;
    }, {});

    const {
      applyStartDate,
      applyDeadlineDate,
      startDate,
      endDate,
      regionAreaCode,
      regionAreaName,
      regionCityCode,
      regionCityName,
      regionProvinceCode,
      regionProvinceName,
      longitude,
      latitude,
      minApplyUserCount,
      maxApplyUserCount,
    } = values;

    result.date1 = [moment(startDate, dateFormat), moment(endDate, dateFormat)];
    result.date2 = [
      moment(applyStartDate, dateFormat),
      moment(applyDeadlineDate, dateFormat),
    ];
    const tude = [longitude || '', latitude || ''];
    result.tude = tude.join(',');
    result.applyUserCount = [minApplyUserCount || 0, maxApplyUserCount || 0];

    try {
      result.provinceLevel = [
        { label: regionProvinceName, value: regionProvinceCode },
        { label: regionCityName, value: regionCityCode },
        { label: regionAreaName, value: regionAreaCode },
      ];

      const targetOption = defaultAreaOptions.find(
        (o) => o.value === regionProvinceCode,
      );
      targetOption.children = [
        {
          ...result.provinceLevel[1],
          level: false,
          children: [{ ...result.provinceLevel[2] }],
        },
      ];
    } catch (error) {}

    return result;
  }

  return (
    <>
      <Form
        {...layout}
        form={form}
        size='small'
        initialValues={makeDefaultValues(defaultValues)}>
        <Row>
          <Col span={12}>
            <Form.Item
              label='所属地址'
              name='provinceLevel'
              rules={[{ required: true, message: '请选择所属地址!' }]}>
              <AreaSelect defaultOptions={defaultAreaOptions} />
            </Form.Item>

            <Form.Item
              label='活动起止日期'
              name='date1'
              rules={[{ required: true, message: '请选择活动起止日期!' }]}>
              <RangePicker size='small' />
            </Form.Item>

            <Form.Item
              label='举办地址'
              name='address'
              rules={[{ required: true, message: '请输入举办地址!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item
              label='举办方'
              name='organizers'
              rules={[{ required: true, message: '请输入举办方!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item
              label='报名名额'
              name='maxUserCount'
              rules={[{ required: true, message: '请输入报名名额!' }]}>
              <InputNumber style={{ width: '100%' }} placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='活动名称'
              name='name'
              rules={[{ required: true, message: '请输入活动名称!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item
              label='报名起止日期'
              name='date2'
              rules={[{ required: true, message: '选择报名起止日期!' }]}>
              <RangePicker size='small' />
            </Form.Item>

            <Form.Item
              label='经纬度'
              name='tude'
              rules={[{ required: true, message: '请输入经纬度!' }]}>
              <Input placeholder='用逗号隔开，前面经度后面纬度' />
            </Form.Item>
            <Form.Item
              label='承办方'
              name='undertaker'
              rules={[{ required: true, message: '请输入承办方!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item
              label='标签'
              name='labels'
              rules={[{ required: true, message: '请输入标签!' }]}>
              <Input placeholder='多个标签以英文逗号隔开' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label='封面图'
              name='tempCoverPicture'
              rules={[{ required: true, message: '请上传封面图!' }]}>
              <UploadImage />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label='图集'
              name='tempPictureItems'
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '请至少上传一张图集!' }]}>
              <UploadImageList />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label='预约电话'
              name='servicePhone'
              rules={[{ required: true, message: '请输入预约电话!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item
              label='报名人数'
              name='applyUserCount'
              rules={[{ required: true, message: '请输入报名人数!' }]}>
              <InputGroup />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='参与要求'
              // notesForAttend
              name='qualificationGuidelines'
              rules={[{ required: true, message: '请输入参与要求!' }]}>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item
              label='是否上架'
              name='isActive'
              rules={[{ required: true, message: '请选择是否上架!' }]}>
              <Radio.Group>
                {activityActiveOptions.map((o) => (
                  <Radio key={o.value} value={o.value}>
                    {o.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label='活动介绍'
          name='description'
          rules={[{ required: true, message: '请输入!' }]}>
          <UploadEditer />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label='其他说明'
          name='note'
          rules={[{ required: true, message: '请输入!' }]}
          style={{
            paddingBottom: 0,
            marginBottom: 0,
            height: 192,
            overflow: 'hidden',
          }}>
          <UploadEditer />
        </Form.Item>
      </Form>
    </>
  );
}
