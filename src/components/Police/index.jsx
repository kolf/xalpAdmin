import React, { useState } from 'react';
import { Tabs } from 'antd';
import Main from '../Layouts/AppMain';
import DataTable1 from './DataTable1';
import DataTable2 from './DataTable2';
import DataTable3 from './DataTable3';
import './style.less';
const { TabPane } = Tabs;

export default function Home() {
  const [show, setShow] = useState(true);
  const [tabKey, setTabKey] = useState('1');
  if (!show) {
    return null;
  }
  return (
    <Main
      show={show}
      onClose={(e) => {
        setShow(false);
      }}
      header={
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          <TabPane tab='闸机' key='1' />
          <TabPane tab='手持机' key='2' />
          <TabPane tab='摄像头' key='3' />
        </Tabs>
      }>
      {tabKey === '1' && <DataTable1 />}
      {tabKey === '2' && <DataTable2 />}
      {tabKey === '3' && <DataTable3 />}
    </Main>
  );
}
