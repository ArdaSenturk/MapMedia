import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  FORGOT_USER_SUCCESS,
  FORGOT_USER_FAIL
} from "../Actions/type";

const INITIAL_STATE = {
  email: "",
  password: "",
  username: "",
  passwordAgain: "",
  status: "",
};

export default (state = INITIAL_STATE, action) => {    
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, status: "attempting" };
    case LOGIN_USER_SUCCESS:      
      return { ...state, status: "loginSuccess" };
    case LOGIN_USER_FAIL:
      return { ...state, status: "loginFail", data: action.data };
    case FORGOT_USER_SUCCESS:
      return { ...state, status: "forgotSuccess" };
    case FORGOT_USER_FAIL:
      return { ...state, status: "forgotFail", data: action.data };
    case REGISTER_USER:
      return { ...state, status: "attempting" };
    case REGISTER_USER_SUCCESS:
      return { ...state, status: "registerSuccess" };
    case REGISTER_USER_FAIL:
      return { ...state, status: "registerFail", data: action.data };
    default:
      return state;
  }
};
