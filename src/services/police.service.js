import queryString from "query-string";
import api from "../core/http";

class PoliceService {
  getDeviceInOutCount = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/InOutCount?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getDeviceLogList = async (creds) => {
    try {
      const res = await api.get(
        `api/DeviceLog/InteractionList?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getDeviceList = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDeviceMapList = async (creds) => {
    try {
      const res = await api.get(
        `iotbase/device/all?itemIds=36&typeIds=4190&isShow=1`
      );
      return res.data.data;
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  getDeviceMap = async (creds) => {
    try {
      const res = await api.get(
        `sightseer/cockpit/queryTouristGate?${queryString.stringify(creds)}`
      );
      return res.data.data;
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  updateDevice = async (creds) => {
    try {
      const res = await api.put(`api/Device/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  switchCertCheck = async (creds) => {
    try {
      const res = await api.post(`api/Device/SwitchCertCheck`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addDevice = async (creds) => {
    try {
      const res = await api.post(`api/Device`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteDevice = async (creds) => {
    try {
      const res = await api.delete(
        `api/Device?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new PoliceService();
