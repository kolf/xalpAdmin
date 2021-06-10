import React, { Component } from "react";
import Routes from "./routes";
import AliMap from "./components/UI/AliMap";
import "./App.less";

export default class App extends Component {
  render() {
    return (
      <>
        <AliMap />
        <Routes />
      </>
    );
  }
}
