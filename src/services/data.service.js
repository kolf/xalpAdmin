import queryString from "query-string";
import api from "../core/http";

class DataService {
  getAreaOptions = async (creds) => {
    try {
      const res = await api.get(
        `api/Region/Items?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单列表
  getOrderAreaList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Area?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单列表
  getOrderAgeList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Age?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getDeviceTotal = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/Count?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getOrderRealTimeStatistics = async (creds) => {
    try {
      const res = await api.get(
        `api/order/RealTimeStatistics?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getOrderCheckTimeRanges = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/CheckTimeRanges?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getOrderStatistics = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Statistics?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getTemplateFileUrl(fileType) {
    return `api/UploadFile/GetSampleFile?fileType=${fileType}`;
  }
  exportCheckTimeRange = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportCheckTimeRange?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockBehavior = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockBehavior/Export?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockAllowRecord = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockAllowUser/Export?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportMerchantList = async (creds) => {
    try {
      const res = await api.get(
        `api/Merchant/Export?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportUserList = async (creds) => {
    try {
      const res = await api.get(
        `api/identity/users/Export?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportOrderList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportDetails?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportStaffList = async (creds) => {
    try {
      const res = await api.get(
        `api/Staff/Export?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范导入
  importBlockBehavior = async (creds) => {
    try {
      const res = await api.post(
        `api/BlockBehavior/Import?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范导入
  importBlockAllowRecord = async (creds) => {
    try {
      const res = await api.post(
        `api/BlockAllowRecord/Import?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范导入
  importMerchantList = async (creds) => {
    try {
      const res = await api.post(
        `api/Merchant/Import?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new DataService();
