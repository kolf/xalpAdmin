import queryString from "query-string";
import api from "../core/http";

class BlacklistService {
  // 黑名单列表
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
  // 黑名单选项
  getBlockAllowUserOptions = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockBehavior/Items?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单详情
  getBlockAllowUser = async (creds) => {
    try {
      const res = await api.get(`/api/BlockAllowUser/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单新增
  addBlockAllowUser = async (creds) => {
    try {
      const res = await api.post(`/api/BlockAllowRecord`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单更新
  updateBlockAllowUser = async (creds) => {
    try {
      const res = await api.put(`/api​/BlockAllowUser​/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 黑名单删除
  deleteBlockAllowUser = async (creds) => {
    try {
      const res = await api.delete(
        `/api/BlockAllowUser?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范列表
  getBlockBehaviorList = async (creds) => {
    try {
      const res = await api.get(
        `api/BlockBehavior/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范删除
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
  // 行为规范更新
  updateBlockBehavior = async (creds) => {
    try {
      const res = await api.put(`api/BlockBehavior/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范添加
  addBlockBehavior = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范导出
  exportBlockBehavior = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 行为规范下载
  getBlockBehaviorFile = async (creds) => {
    try {
      const res = await api.post(`api/BlockBehavior/${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new BlacklistService();
