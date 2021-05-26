import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import sessionService from "../../services/session.service";
import * as sessionActions from "../../store/actions/session.actions";
import history from "../../shared/history";
import utils from "../../shared/utils";

import "./Login.css";

const queryString = require("query-string");
class Login extends React.Component {
  state = {
    loading: true,
  };
  async componentDidMount() {
    sessionStorage.clear();
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.token) {
      try {
        const res = await sessionService.getToken(parsed.token);
        if (res) {
          history.push("/");
        }
      } catch (error) {
        window.location.href =
          "http://114.67.250.8/#/login?redirectUrl=http://114.67.250.8/topark/login&appCode=ENTERPARKnL4gX4cG8tJ2zW4r";
      }
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  onFinish = async (values) => {
    try {
      const res = await this.props.onLogin(values);
    } catch (error) {
      utils.error(`登录失败，请稍候再试！`);
    }
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return null;
    }
    return sessionService.isAuthenticated() ? (
      <Redirect to="/" />
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
