import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import sessionService from '../../services/session.service';
import Main from '../Layouts/AppMain';
import DataTable1 from './DataTable1';
import DataTable2 from './DataTable2';
import DataTable3 from './DataTable3';
import DataTable4 from './DataTable4';
import './style.less';
const { TabPane } = Tabs;

const allTab = [
  { value: '1', label: '用户管理' },
  { value: '2', label: '角色管理' },
  { value: '3', label: '服务商管理' },
  { value: '4', label: '部门管理' },
];

export default function Home() {
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
    if (/AbpIdentity.Users/.test(roles)) {
      result.push('1');
    }
    if (/AbpIdentity.Roles/.test(roles)) {
      result.push('2');
    }
    if (/SmartTicketing.Providers/.test(roles)) {
      result.push('3');
    }
    if (/AbpIdentity.Organizations/.test(roles)) {
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
    </Main>
  );
}
