import queryString from "query-string";
import api from "../core/http";

class UserService {
  getAllRole = async (creds) => {
    try {
      const res = await api.get(
        `api/identity/roles/all?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getRoleList = async (creds) => {
    try {
      const res = await api.get(
        `api/identity/roles?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateRole = async (creds) => {
    try {
      const res = await api.put(`api/Role/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addRole = async (creds) => {
    try {
      const res = await api.post(`api/Role`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteRole = async (creds) => {
    try {
      const res = await api.delete(`api/Role?${queryString.stringify(creds)}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  getUserList = async (creds) => {
    try {
      const res = await api.get(
        `api/identity/users?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateUser = async (creds) => {
    try {
      const res = await api.put(`api/identity/users​/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addUser = async (creds) => {
    try {
      const res = await api.post(`api/identity/users​`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteUser = async (creds) => {
    try {
      const res = await api.delete(
        `api/identity/users​?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new UserService();
