import { message } from "antd";

import moment from "moment";

class Utils {
  success = (msg, duration = 1) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      message.success(msg, duration);
    }, 30);
  };

  error = (msg, duration = 1) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      message.error(msg, duration);
    }, 30);
  };

  dateTimeFormater = (datetime, formatString) => {
    return moment(datetime).format(formatString);
  };
}

export default new Utils();
