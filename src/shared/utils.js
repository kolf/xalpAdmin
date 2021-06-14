import moment from "moment";
import { message } from "antd";

let timer = null;
class Utils {
  success = (msg) => {
    if (timer) {
      message.destroy()
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      message.success(msg);
    }, 120);
  };

  error = (msg) => {
    if (timer) {
      message.destroy()
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      message.error(msg);
    }, 120);
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

  todo = (number) => {
    return number < 10 ? "0" + number : number;
  };
}

export default new Utils();
