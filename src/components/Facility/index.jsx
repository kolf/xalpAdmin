import React, { useState } from 'react';
import { Tabs } from 'antd';
import Main from '../Layouts/AppMain';
import DataTable1 from './DataTable1';
import DataTable2 from './DataTable2';
import DataTable3 from './DataTable3';
import DataTable4 from './DataTable4';
import DataTable5 from './DataTable5';
import sessionService from '../../services/session.service';
import './style.less';
const { TabPane } = Tabs;

const allTab = [
  { value: '1', label: '个人参观' },
  { value: '2', label: '团体参观' },
  { value: '5', label: '入园记录' },
  { value: '3', label: '工作人员' },
  { value: '4', label: '服务商人员' },
];

function Facility() {
  const roles = sessionService.getUserRoles();
  const [show, setShow] = useState(true);
  const tabKeys = getTabKeys(roles);
  const tabList = allTab.filter((tab) => tabKeys.includes(tab.value));
  const [tabKey, setTabKey] = useState(
    tabList.length > 0 ? tabList[0].value : -1,
  );

  if (tabList.length === 0 && !show) {
    return null;
  }

  function getTabKeys(roles) {
    let result = [];
    if (/SmartTicketingReservation.Personal/.test(roles)) {
      result.push('1');
    }
    if (/SmartTicketingReservation.Group/.test(roles)) {
      result.push('2');
    }
    if (/SmartTicketing.Merchants/.test(roles)) {
      result.push('5');
    }
    if (/SmartTicketing.CheckRecords/.test(roles)) {
      result.push('3');
    }
    if (/SmartTicketing.Staffs/.test(roles)) {
      result.push('4');
    }

    return result;
  }

  return (
    <Main
      show={show}
      onClose={(e) => {
        setShow(false);
      }}
      header={
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          {tabList.map((tab) => (
            <TabPane tab={tab.label} key={tab.value} />
          ))}
        </Tabs>
      }>
      {tabKey === '1' && <DataTable1 />}
      {tabKey === '2' && <DataTable2 />}
      {tabKey === '3' && <DataTable3 />}
      {tabKey === '4' && <DataTable4 />}
      {tabKey === '5' && <DataTable5 />}
    </Main>
  );
}
export default React.memo(Facility);
