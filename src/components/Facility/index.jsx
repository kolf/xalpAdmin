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

function Facility() {
  const roles = sessionService.getUserRoles();
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
          {/SmartTicketingReservation.Personal/.test(roles) && (
            <TabPane tab='个人参观' key='1' />
          )}
          {/SmartTicketingReservation.Group/.test(roles) && (
            <TabPane tab='团体参观' key='2' />
          )}
          {/SmartTicketing.CheckRecords/.test(roles) && (
            <TabPane tab='入园记录' key='5' />
          )}
          {/SmartTicketing.Staffs/.test(roles) && (
            <TabPane tab='工作人员' key='3' />
          )}
          {/SmartTicketing.Merchants/.test(roles) && (
            <TabPane tab='服务商人员' key='4' />
          )}
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
