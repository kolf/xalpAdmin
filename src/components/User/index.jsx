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

export default function Home() {
  const roles = sessionService.getUserRoles();
  const [show, setShow] = useState(true);
  const [tabs, setTabs] = useState([]);
  const [tabKey, setTabKey] = useState('');

  useEffect(() => {
    if (tabs.length === 0) {
      const nextTabs = getTabs();
      setTabs(nextTabs);
      if (nextTabs.length > 0) {
        setTabKey(nextTabs[0].key);
      }
    }

    function getTabs() {
      let result = [];
      if (/AbpIdentity.Users/.test(roles)) {
        result.push({ key: '1', label: '用户管理' });
      }
      if (/AbpIdentity.Roles/.test(roles)) {
        result.push({ key: '2', label: '角色管理' });
      }
      if (/SmartTicketing.Providers/.test(roles)) {
        result.push({ key: '3', label: '服务商管理' });
      }
      if (/AbpIdentity.Organizations/.test(roles)) {
        result.push({ key: '4', label: '部门管理' });
      }

      return result;
    }
  }, [roles]);

  if (!show || tabs.length === 0) {
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
          {tabs.map((tab) => (
            <TabPane tab={tab.label} key={tab.key} />
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
