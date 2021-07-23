import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT } from "./types";
import sessionService from "../../services/session.service";

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

export const loginSuccess = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    userData: userData,
  };
};

export const loginFail = (error) => {
  return {
    type: LOGIN_FAILURE,
    error: error,
  };
};

export const login = (creds) => {
  return (dispatch) => {
    dispatch(loginRequest());
    return sessionService
      .login(creds)
      .then((res) => {
        dispatch(loginSuccess(res));
        return Promise.resolve(res);
      })
      .catch((error) => {
        dispatch(loginFail(error));
        return Promise.reject(error);
      });
  };
};

export const logout = () => {
  sessionService.logout();
  return { type: LOGOUT };
};
