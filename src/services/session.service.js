import axios from "axios";
import queryString from "query-string";
import config from "../config";
import history from "../shared/history";

class SessionService {
  login = async (creds) => {
    try {
      const res = await axios
        .post(
          `${config.api.baseUrl}/auth/oauth/token?${queryString.stringify({
            grant_type: "password",
            ...creds,
          })}`,
          null,
          {
            headers: {
              Authorization: "Basic ZGQ6ZGQ=",
            },
          }
        )
        .then((res) => res.data.data);
      const token = res.access_token;
      const userData = res.user_info;
      sessionStorage.setItem("@Auth:token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      history.push("/park-management");
      return Promise.resolve(userData);
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
}

export default new SessionService();
