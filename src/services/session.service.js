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
      const roles = await this.getRoles(token);
      sessionStorage.setItem("@Auth:token", token);
      sessionStorage.setItem("@Auth:roles", roles);
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // config.headers.common.Authorization = `Bearer ${token}`;
  getRoles = async (token) => {
    // const token = sessionStorage.getItem("@Auth:token")
    try {
      const res = await axios.get(`api/application-configuration`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = Object.keys(res.data.auth.grantedPolicies);
      if (result.length === 0) {
        throw `对不起，您没有权限！`;
      }
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(`对不起，您没有权限！`);
    }
  };

  logout = () => {
    sessionStorage.clear();
    const host = window.location.host;
    window.location.href = `//${host}/#/login?redirectUrl=//${host}/topark/&appCode=ENTERPARKnL4gX4cG8tJ2zW4r`;
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
  };

  getUserRoles = () => {
    return sessionStorage.getItem("@Auth:roles") || "";
  };
}

export default new SessionService();
