import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { ConfigProvider } from "antd";
import { Map, APILoader } from '@uiw/react-amap';
import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import App from "./App";
import rootReducer from "./store/reducers";

moment.locale('zh-cn');

const store = compose(applyMiddleware(ReduxThunk))(createStore)(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const app = (
  <Provider store={store}>
    <ConfigProvider locale={zhCN} >
      <APILoader akay='c54dd5d1143cb8ea800f1d5e8d48502a'><App /></APILoader>
    </ConfigProvider>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
// registerServiceWorker();
