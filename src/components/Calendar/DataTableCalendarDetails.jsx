import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Form, Input, Select } from 'antd';
import UpdateDataForm from './DataTableUpdateTabs';
import modal from '../../shared/modal';
import confirm from '../../shared/confirm';
import utils from '../../shared/utils';
import faciliyService from '../../services/faciliy.service';
const dateFormat = 'YYYY-MM-DD';

export default function DataTable({ id, dataSource, onClose }) {
  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.timeRanges.map((item, index) => {
      return { ...item, index: index + 1 };
    });
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将删除这条数据, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await faciliyService.deleteReservationTimeSetting({
          isSpecial: true,
          id: creds.timeSettingId,
        });
        mod.close();
        utils.success(`删除成功！`);
        onClose();
      } catch (error) {
        mod.close();
      }
    }
  }

  function showEditModal(creds) {
    let warningLeftQuantity;
    if (dataSource.timeRanges && dataSource.timeRanges[0]) {
      warningLeftQuantity =
        dataSource.timeRanges[0].groupWarningLeftQuantity ||
        dataSource.timeRanges[0].individualWarningLeftQuantity;
    }
    const mod = modal({
      content: (
        <UpdateDataForm
          defaultValues={{
            ...dataSource,
            warningLeftQuantity,
            isSpecial: true,
            dateTitle: id,
            id: dataSource.timeSettingId,
          }}
          onOk={onOk}
        />
      ),
      footer: null,
    });
    function onOk() {
      mod.close();
      onClose();
    }
  }

  const columns = [
    {
      title: '时段',
      dataIndex: 'TimeRange',
      render(text, creds) {
        const { startTimeRange, endTimeRange } = creds;
        if (startTimeRange === '00:00' && endTimeRange === '24:00') {
          return '全天';
        }
        return startTimeRange + '-' + endTimeRange;
      },
    },
    {
      title: '门票数量/剩余数量',
      dataIndex: 'remainTouristsQuantity',
      render(text, creds) {
        return (
          creds.maxTouristsQuantity +
          '/' +
          (creds.groupRemainTouristsQuantity +
            creds.individualRemainTouristsQuantity)
        );
      },
    },
    {
      title: '个人时段票数量/剩余数量',
      dataIndex: 'individualMaxTouristsQuantity',
      render(text, creds) {
        return (
          creds.individualMaxTouristsQuantity +
          '/' +
          creds.individualRemainTouristsQuantity
        );
      },
    },
    {
      title: '团体时段票数量/剩余数量',
      dataIndex: 'groupMaxTouristsQuantity',
      render(text, creds) {
        return (
          creds.groupMaxTouristsQuantity +
          '/' +
          creds.groupRemainTouristsQuantity
        );
      },
    },
    {
      title: '库存提示',
      dataIndex: 'warningLeftQuantity',
      render(text, creds) {
        return (
          creds.groupWarningLeftQuantity ||
          creds.individualWarningLeftQuantity ||
          '无'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      render(text, creds, index) {
        const obj = {
          children: (
            <div className='text-center'>
              <Button
                size='small'
                style={{ marginRight: 4 }}
                onClick={(e) => showEditModal(creds)}>
                编辑
              </Button>
              <Button size='small' onClick={(e) => showDeleteModal(dataSource)}>
                删除
              </Button>
            </div>
          ),
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = makeData(dataSource).length;
        } else {
          obj.props.rowSpan = 0;
        }

        return obj;
      },
    },
  ];

  return (
    <>
      <div className='calendar-details-title'>{id}</div>
      <Table
        rowKey='timeRangeName'
        dataSource={makeData(dataSource)}
        columns={columns}
        pagination={false}
        size='small'
        bordered
      />
    </>
  );
}
