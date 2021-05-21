import queryString from "query-string";
import api from "../core/http";

class FaciliyService {
  getBlockBehaviorList = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockBehavior/List?${queryString.stringify(creds)}`
      );
      return res.data.items;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getBlockAllowUserList = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockAllowUser/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  deleteBlockBehavior = async (creds) => {
    try {
      const res = await api.delete(
        `api/BlockBehavior?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateBlockBehavior = async (id) => {
    try {
      const res = await api.put(`api/BlockBehavior/${id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  addBlockBehavior = async (id) => {
    try {
      const res = await api.put(`api/BlockBehavior/${id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockBehavior = async (id) => {
    try {
      const res = await api.put(`api/BlockBehavior/${id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getBlockBehaviorFile = async (id) => {
    try {
      const res = await api.put(`api/BlockBehavior/${id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new FaciliyService();
