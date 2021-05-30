import { message } from "antd";
import axios from "axios";
import config from "../config";
import sessionService from "../services/session.service";
/**
 * Axios defaults
 */
axios.defaults.baseURL = config.api.baseUrl;

// Headers
axios.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.common["Tenant-Id"] = 10100;
axios.defaults.headers.common["Accept-language"] = 'zh-Hans';
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig;
    // Check for and add the stored Auth Token to the header request
    let token = sessionStorage.getItem("@Auth:token");
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    throw error;
  }
);

/**
 * Response Interceptor
 */
axios.interceptors.response.use(
  (res) => {
    // Status code isn't a success code - throw error
    if (!`${res.status}`.startsWith("2")) {
      throw res.data;
    }

    // Otherwise just return the data
    return res;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionService.logout();
      return;
    }
    if (error.response && (error.response.data || {}).error) {
      message.error(error.response.data.error.message,1)
      throw error.response.data;
    }
    // Pass the response from the API, rather than a status code
    if (error && error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
);

export default axios;
