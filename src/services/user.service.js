import queryString from "query-string";
import api from "../core/http";

class UserService {
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
  updateBlockBehavior = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  addBlockBehavior = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  exportBlockBehavior = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior/Import`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getBlockBehaviorFile = async (creds) => {
    try {
      const res = await api.get(
        `api/UploadFile/GetSampleFile/${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new UserService();
