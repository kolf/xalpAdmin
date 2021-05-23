import queryString from "query-string";
import api from "../core/http";

class BlacklistService {
  // 黑名单新增
  getUploadPath = async (creds) => {
    try {
      const res = await api.get(
        `/api/UploadFile/GetTempFileItem?${queryString.stringify(creds)}`
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getOptions = async (creds) => {
    try {
      const res = await api.get(`/api/OptionItem?Category=${creds.id}`);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new BlacklistService();
