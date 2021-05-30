import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { ConfigProvider } from "antd";

import zhCN from "antd/lib/locale/zh_CN";
import "moment/locale/zh-cn";
import App from "./App";
import rootReducer from "./store/reducers";

const store = compose(applyMiddleware(ReduxThunk))(createStore)(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const app = (
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
// registerServiceWorker();
