import queryString from "query-string";
import api from "../core/http";

class FaciliyService {
  getStaffCheckRecords = async (creds) => {
    try {
      const res = await api.get(
        `api/TicketCardInfo/StaffCheckRecords?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 预约管理-服务商
  getMerchantList = async (creds) => {
    try {
      const res = await api.get(
        `api/Merchant/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateMerchant = async (creds) => {
    try {
      const res = await api.put(`api/Merchant/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addMerchant = async (creds) => {
    try {
      const res = await api.post(`api/Merchant`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteMerchant = async (creds) => {
    try {
      const res = await api.delete(
        `api/Merchant?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 预约管理-员工
  getStaffList = async (creds) => {
    try {
      const res = await api.get(
        `api/Staff/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateStaff = async (creds) => {
    try {
      const res = await api.put(`api/Staff/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addStaff = async (creds) => {
    try {
      const res = await api.post(`api/Staff`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteStaff = async (creds) => {
    try {
      const res = await api.delete(`api/Staff?${queryString.stringify(creds)}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 预约时段
  getReservationTimeItemOptions = async (creds) => {
    try {
      const res = await api.get(
        `api/ReservationTimeItem/Items?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateReservationTimeItem = async (creds) => {
    try {
      const res = await api.put(`api/ReservationTimeItem/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addReservationTimeItem = async (creds) => {
    try {
      const res = await api.post(`api/ReservationTimeItem`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteReservationTimeItem = async (creds) => {
    try {
      const res = await api.delete(
        `api/ReservationTimeItem?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 预约量
  getReservationTimeSettingList = async (creds) => {
    try {
      const res = await api.get(
        `api/ReservationTimeSetting/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getReservationTimeRangeList = async (creds) => {
    try {
      const res = await api.get(
        `api/ReservationTimeRange/RangeCalendarItems?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateReservationTimeSetting = async (creds) => {
    try {
      const res = await api.put(
        `api/ReservationTimeSetting/${creds.id}`,
        creds, {
        data: { showError: false }
      }
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addReservationTimeSetting = async (creds) => {
    try {
      const res = await api.post(`api/ReservationTimeSetting`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteReservationTimeSetting = async (creds) => {
    try {
      const res = await api.delete(
        `api/ReservationTimeSetting?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 个人预约
  getOrderDetailList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/OrderDetailList?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 团体预约
  getOrderList = async (creds) => {
    try {
      const res = await api.get(
        `api/Order/OrderList?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  checkOrderList = async (creds) => {
    try {
      const res = await api.post(`api/Order/CheckAll/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  checkOrder = async (creds) => {
    try {
      const res = await api.post(`api/Order/Check/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  cancelOrder = async (creds) => {
    try {
      const res = await api.post(`api/Order/Cancel/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  cancelOrderList = async (creds) => {
    try {
      const res = await api.post(`api/Order/CancelAll/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new FaciliyService();
