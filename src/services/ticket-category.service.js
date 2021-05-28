import queryString from "query-string";
import api from "../core/http";

class FaciliyService {
  // 预约管理-供应商
  getProductList = async (creds) => {
    try {
      const res = await api.get(
        `api/Product/List?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  updateProduct = async (creds) => {
    try {
      const res = await api.put(`api/Product/${creds.id}/UpdateQuickly`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addProduct = async (creds) => {
    try {
      const res = await api.post(`api/Product/CreateQuickly`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteProduct = async (creds) => {
    try {
      const res = await api.delete(
        `api/Product?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new FaciliyService();
