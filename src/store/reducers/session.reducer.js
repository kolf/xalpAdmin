import {
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../actions/types";

const initialState = {
  isFetching: false,
  error: null,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOGIN_SUCCESS:
      return {
        isFetching: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        user: null,
        isFetching: false,
        error: action.error,
      };
    case LOGOUT:
      return {
        user: null,
        isFetching: false,
        error: null,
      };
    default:
      return state;
  }
};

export default sessionReducer;
