import queryString from "query-string";
import api from "../core/http";

class UserService {
  getAllRole = async (creds) => {
    try {
      const res = await api.get(`api/identity/roles/all`);
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
      const res = await api.put(`api/identity/roles/${creds.id}`, {
        ...creds,
        providerKey: undefined,
      });
      const res1 = await api.put(
        `api/permission-management/permissions?providerName=R&providerKey=${creds.providerKey}`,
        {
          permissions: creds.permissions.map((item) => ({
            name: item,
            isGranted: true,
          })),
        }
      );
      return res.data;
    } catch (error) {
      console.log(error, "error")
      return Promise.reject(error);
    }
  };

  addRole = async (creds) => {
    try {
      const res = await api.post(`api/identity/roles`, {
        name: creds.name,
      });
      const res1 = await api.put(
        `api/permission-management/permissions?providerName=R&providerKey=${creds.providerKey}`,
        {
          permissions: creds.permissions.map((item) => ({
            name: item,
            isGranted: true,
          })),
        }
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteRole = async (creds) => {
    try {
      const res = await api.delete(`api/identity/roles/${creds.id}`);
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
  getAllPermissions = async (creds) => {
    try {
      const res = await api.get(
        `api/permission-management/permissions?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateUser = async (creds) => {
    try {
      const res = await api.put(`api/identity/users/${creds.id}`, creds);
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
