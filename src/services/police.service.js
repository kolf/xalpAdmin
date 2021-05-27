import queryString from "query-string";
import api from "../core/http";

class PoliceService {
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
  updateDevice = async (creds) => {
    try {
      const res = await api.put(`api/Device/${creds.id}`, creds);
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
