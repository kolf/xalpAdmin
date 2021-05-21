import queryString from "query-string";
import api from "../core/http";

class BlacklistService {
  getBlacklist = (creds) => {
    try {
      return api
        .post(`BlockBehavior/List?${queryString.stringify(creds)}`)
        .then((res) => res.data.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new BlacklistService();
