import { message } from "antd";

import moment from "moment";

let _timer = null;
class Utils {
  success = (msg, duration = 1) => {
    clearTimeout(_timer);
    _timer = setTimeout(() => {
      message.success(msg, duration);
    }, 30);
  };

  error = (msg, duration = 1) => {
    clearTimeout(_timer);
    _timer = setTimeout(() => {
      message.error(msg, duration);
    }, 30);
  };

  dateTimeFormater = (datetime, formatString) => {
    return moment(datetime).format(formatString);
  };
}

export default new Utils();
