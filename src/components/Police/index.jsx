import React, { useState } from 'react';
import { Tabs } from 'antd';
import Main from '../Layouts/AppMain';
import DataTable1 from './DataTable1';
import DataTable2 from './DataTable2';
<<<<<<< HEAD
import DataTable3 from './DataTable3';
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
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
<<<<<<< HEAD
          <TabPane tab='摄像头' key='3' />
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
        </Tabs>
      }>
      {tabKey === '1' && <DataTable1 />}
      {tabKey === '2' && <DataTable2 />}
<<<<<<< HEAD
      {tabKey === '3' && <DataTable3 />}
=======
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
    </Main>
  );
}
