import React, { Suspense } from "react";
import { Spin } from "antd";
import { RootRouter } from "./routes";
import AliMap from "./components/UI/AliMap";
import "./App.less";

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <AliMap />
      <RootRouter />
    </Suspense>
  );
}

export default App;
