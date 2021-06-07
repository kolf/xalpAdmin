import moment from "moment";
import message from "./message";

class Utils {
  success = (msg) => {
    message({ type: "success", content: msg });
  };

  error = (msg) => {
    message({ type: "error", content: msg });
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
