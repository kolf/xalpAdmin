import { message } from "antd";

import moment from "moment";

let _timer = null;
class Utils {
  success = (msg, duration = 1) => {
    message.success(msg, duration);
  };

  error = (msg, duration = 1) => {
    message.error(msg, duration);
  };

  dateTimeFormater = (datetime, formatString) => {
    return moment(datetime).format(formatString);
  };

  numberFixed = (number, size = 4) => {
    if (size === 4) {
      if (number < 10000) {
        return number;
      }
      return (number / 10000).toFixed(2);
    }
  };
}

export default new Utils();
