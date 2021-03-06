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
              label='????????????'
              name='provinceLevel'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <AreaSelect defaultOptions={defaultAreaOptions} />
            </Form.Item>

            <Form.Item
              label='??????????????????'
              name='date1'
              rules={[{ required: true, message: '???????????????????????????!' }]}>
              <RangePicker size='small' />
            </Form.Item>

            <Form.Item
              label='????????????'
              name='address'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>
            <Form.Item
              label='?????????'
              name='organizers'
              rules={[{ required: true, message: '??????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>
            <Form.Item
              label='????????????'
              name='maxUserCount'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <InputNumber style={{ width: '100%' }} placeholder='?????????' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='????????????'
              name='name'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>

            <Form.Item
              label='??????????????????'
              name='date2'
              rules={[{ required: true, message: '????????????????????????!' }]}>
              <RangePicker size='small' />
            </Form.Item>

            <Form.Item
              label='?????????'
              name='tude'
              rules={[{ required: true, message: '??????????????????!' }]}>
              <Input placeholder='??????????????????????????????????????????' />
            </Form.Item>
            <Form.Item
              label='?????????'
              name='undertaker'
              rules={[{ required: true, message: '??????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>
            <Form.Item
              label='??????'
              name='labels'
              rules={[{ required: true, message: '???????????????!' }]}>
              <Input placeholder='?????????????????????????????????' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label='?????????'
              name='tempCoverPicture'
              rules={[{ required: true, message: '??????????????????!' }]}>
              <UploadImage />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label='??????'
              name='tempPictureItems'
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '???????????????????????????!' }]}>
              <UploadImageList />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label='????????????'
              name='servicePhone'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>

            <Form.Item
              label='????????????'
              name='applyUserCount'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <InputGroup />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='????????????'
              // notesForAttend
              name='qualificationGuidelines'
              rules={[{ required: true, message: '?????????????????????!' }]}>
              <Input placeholder='?????????' />
            </Form.Item>

            <Form.Item
              label='????????????'
              name='isActive'
              rules={[{ required: true, message: '?????????????????????!' }]}>
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
          label='????????????'
          name='description'
          rules={[{ required: true, message: '?????????!' }]}>
          <UploadEditer />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label='????????????'
          name='note'
          rules={[{ required: true, message: '?????????!' }]}
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
