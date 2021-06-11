import queryString from "query-string";
import api from "../core/http";

class ActivityService {
  // 预约管理-供应商
  getActivityList = async (creds) => {
    try {
      const res = await api.get(
        `api/ParkActivity/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateActivity = async (creds) => {
    try {
      const res = await api.put(`api/ParkActivity/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addActivity = async (creds) => {
    try {
      const res = await api.post(`api/ParkActivity`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateActivityStatus = async (creds) => {
    try {
      const res = await api.post(`api/ParkActivity/Change/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteActivity = async (creds) => {
    try {
      const res = await api.delete(
        `api/ParkActivity?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getActivityOrderList = async (creds) => {
    try {
      const res = await api.get(
        `api/ActivityOrder/ActivityOrderList?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getActivityOrderDetails = async (creds) => {
    try {
      const res = await api.get(
        `api/ActivityOrder/Detail?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateActivityOrderStatus = async (creds) => {
    try {
      const res = await api.post(
        `api/ActivityOrder/Audit/${creds.id}`,
        creds
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new ActivityService();
