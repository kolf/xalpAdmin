import axios from "axios";
import queryString from "query-string";
import config from "../config";
import history from "../shared/history";

class SessionService {
  login = async (creds) => {
    try {
      const res1 = await axios.post(
        `auth/oauth/token?${queryString.stringify({
          grant_type: "password",
          ...creds,
        })}`,
        null,
        {
          headers: {
            Authorization: "Basic ZGQ6ZGQ=",
          },
        }
      );
      const { access_token: ossAccessToken, user_info: userData } =
        res1.data.data;

      await this.getToken(ossAccessToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getToken = async (ossAccessToken) => {
    try {
      const res = await axios.post("api/LbyTokenAuth", {
        ossAccessToken,
      });
      const token = res.data.access_token;
      sessionStorage.setItem("@Auth:token", token);
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  logout = () => {
    sessionStorage.clear();
    history.push("/login");
  };

  getUser = () => {
    return sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null;
  };

  isAuthenticated = () => {
    return !!sessionStorage.getItem("@Auth:token");
  };

  getUserToken = () => {
    return sessionStorage.getItem("@Auth:token");
  }
}

export default new SessionService();
