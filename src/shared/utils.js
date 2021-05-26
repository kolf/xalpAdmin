import { message } from "antd";

import moment from "moment";

class Utils {
  success = (msg, duration = 1) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      message.success(msg, duration);
    }, 300);
  };

  error = (msg) => message.error(msg);

  warning = (msg) => message.warning(msg);

  info = (msg) => message.info(msg);

  dateTimeFormater = (datetime, formatString) => {
    return moment(datetime).format(formatString);
  };
}

export default new Utils();
