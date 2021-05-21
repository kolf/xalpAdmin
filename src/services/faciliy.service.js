import queryString from "query-string";
import api from "../core/http";

class FaciliyService {
  // 时段分页列表获取
  getReservationTimeList = async (creds) => {
    try {
      const res = await api.get(
        `api/ReservationTimeItem/List?${queryString.stringify(creds)}`
      );
      return res.data.items;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getReservationTime = async (creds) => {
    try {
      const res = await api.get(`/api/ReservationTimeItem/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  deleteReservationTime = async (creds) => {
    try {
      const res = await api.delete(`/api/ReservationTimeItem/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateReservationTime = async (creds) => {
    try {
      const res = await api.post(
        `api​/ReservationTimeItem​/${creds.id}`,
        creds
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  addReservationTime = async (creds) => {
    try {
      const res = await api.post(`api/ReservationTimeItem`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new FaciliyService();
