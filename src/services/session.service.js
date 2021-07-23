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
      const { access_token: ossAccessToken } = res1.data.data;

      const newToken = await this.getToken(ossAccessToken);
      return Promise.resolve(newToken);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getToken = async (ossAccessToken) => {
    // debugger;
    try {
      const res = await axios.post("api/LbyTokenAuth", {
        ossAccessToken,
      });
      const newToken = res.data.access_token;
      const { roles, userInfo } = await this.getRoles(newToken);
      sessionStorage.setItem("@Auth:token", newToken);
      sessionStorage.setItem("@Auth:roles", roles);
      sessionStorage.setItem("user", JSON.stringify(userInfo));
      return Promise.resolve(newToken);
    } catch (error) {
      console.log(error, "error");
      return Promise.reject(error);
    }
  };
  // config.headers.common.Authorization = `Bearer ${token}`;
  getRoles = async (token) => {
    try {
      const res = await axios.get(`api/application-configuration`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = Object.keys(res.data.auth.grantedPolicies);
      if (result.length === 0) {
        throw new Error(`对不起，您没有权限！`);
      }
      return Promise.resolve({ roles: result, userInfo: res.data.currentUser });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  logout = () => {
    sessionStorage.clear();
    const host = window.location.host;
    window.location.href = `//${host}/#/login?redirectUrl=//${host}/topark/login&appCode=ENTERPARKnL4gX4cG8tJ2zW4r`;
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
