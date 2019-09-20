import {
  POST,
  POST_SUCCESS,
  POST_FAIL,
  GET_POST,
  GET_POST_SUCCESS,
  GET_POST_FAIL,
  GET_POSTS,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAIL,
  SEND_POST,
  SEND_POST_SUCCESS,
  SEND_POST_FAIL
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
    case POST:
      return { ...state, status: "attempting" };
    case POST_SUCCESS:      
      return { ...state, status: "postSuccess", data: action.data };
    case POST_FAIL:
      return { ...state, status: "postFail", data: action.data };
    case GET_POST:
      return { ...state, status: "attempting" };
    case GET_POST_SUCCESS:      
      return { ...state, status: "getPostSuccess", data: action.data };
    case GET_POST_FAIL:
      return { ...state, status: "getPostFail" };
    case GET_POSTS:
      return { ...state, status: "attempting" };
    case GET_POSTS_SUCCESS:      
      return { ...state, status: "getPostsSuccess", data: action.data };
    case GET_POSTS_FAIL:
      return { ...state, status: "getPostsFail" };
    case SEND_POST:
      return { ...state, status: "attempting" };
    case SEND_POST_SUCCESS:
      return { ...state, status: "sendPostsSuccess" };
    case SEND_POST_FAIL:
      return { ...state, status: "sendPostsFail" };
    default:
      return state;
  }
};
