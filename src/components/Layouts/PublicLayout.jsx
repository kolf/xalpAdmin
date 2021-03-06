import React from "react";
import { Route } from "react-router-dom";

import "./PublicLayout.css";

export default class PublicLayout extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;

    return <div className="public-layout-root"><Route {...rest} render={(props) => <Component {...props} />} /></div>;
  }
}
