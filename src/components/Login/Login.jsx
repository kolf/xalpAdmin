import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Input, Button } from "antd";
import sessionService from "../../services/session.service";
import * as sessionActions from "../../store/actions/session.actions";

import "./Login.css";
class Login extends React.Component {
  state = {};

  componentDidMount() {
    this.props.logout();
  }

  onFinish = (values) => {
    this.props.onLogin(values);
  };

  render() {
    return sessionService.isAuthenticated() ? (
      <Redirect to="/park-management" />
    ) : (
      <div className="login-form-root">
        <div className="login-form">
          <Form onFinish={this.onFinish}>
            <h1>账号密码登录</h1>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input size="large" placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input size="large" type="password" placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="login-form-submit"
                loading={this.props.isFetching}
              >
                登录
              </Button>
            </Form.Item>
            <p className="copyright">Copyright © 2021 dreamdeck.cn</p>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.session.isFetching,
    error: state.session.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (credentials) => dispatch(sessionActions.login(credentials)),
    logout: () => dispatch(sessionActions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
