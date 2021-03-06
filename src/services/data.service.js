import queryString from 'query-string';
import api from '../core/http';

class DataService {
  exportDeviceInOutRecords = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/ExportDeviceInOutRecords?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  exportStaffCheckRecords = async (creds) => {
    try {
      const res = await api.get(
        `api/TicketCardInfo/ExportStarffCheckRecords?${queryString.stringify(
          creds,
        )}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getAreaOptions = async (creds) => {
    try {
      const res = await api.get(
        `api/Region/Items?${queryString.stringify(creds)}`,
      );
      return res.data.items || [];
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getAreaTopProvince = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/AreaTopProvince?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getOrderAreaList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Area?${queryString.stringify(creds)}`,
      );
      return res.data.items || [];
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  getOrderCityList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/CityArea?${queryString.stringify(creds)}`,
      );
      return res.data.items || [];
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  getOrderAgeList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Age?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getDeviceTotal = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/Count?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getOrderRealTimeStatistics = async () => {
    try {
      const res = await api.get(`api/order/RealTimeStatistics`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getOrderCheckTimeRanges = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/CheckTimeRanges?${queryString.stringify(creds)}`,
      );
      return res.data || [];
    } catch (error) {
      return Promise.resolve([]);
    }
  };
  getOrderStatistics = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/Statistics?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getTemplateFileUrl(fileType) {
    return `api/UploadFile/GetSampleFile?fileType=${fileType}`;
  }

  getBlockBehaviorTemplateFileUrl = async () => {
    try {
      const res = await api.get(`api/BlockBehavior/ExportTemplate`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  exportCheckTimeRange = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportCheckTimeRange?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockBehavior = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockBehavior/Export?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockAllowRecord = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockAllowUser/Export?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportMerchantList = async (creds) => {
    try {
      const res = await api.get(
        `api/Merchant/Export?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportUserList = async (creds) => {
    try {
      const res = await api.get(
        `api/identity/users/Export?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportOrderList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportDetails?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportStaffList = async (creds) => {
    try {
      const res = await api.get(
        `api/Staff/Export?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportAgeList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportAgeRange?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportAreaList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/ExportCityAreaRange?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // ??????????????????
  importBlockBehavior = async (creds) => {
    try {
      const res = await api.post(
        `api/BlockBehavior/Import?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // ??????????????????
  importBlockAllowRecord = async (creds) => {
    try {
      const res = await api.post(
        `api/BlockAllowRecord/Import?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // ??????????????????
  importMerchantList = async (creds) => {
    try {
      const res = await api.post(
        `api/Merchant/Import?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new DataService();
