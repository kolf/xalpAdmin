import { createBrowserHistory } from "history";
import config from "../config";

const history = createBrowserHistory({
  baseUrl: config.app.baseUrl,
});

export default history;
