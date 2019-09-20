import * as firebase from "firebase";
import { AsyncStorage } from "react-native"
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  FORGOT_USER_SUCCESS,
  FORGOT_USER_FAIL,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL
} from "../type";

//Login
export const login = (email, password) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => loginSuccess(dispatch, user))
      .catch(err => loginFail(dispatch, err.code));
  };
};

const loginSuccess = (dispatch, user) => {
  const { currentUser } = firebase.auth()  
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
  AsyncStorage.setItem("user", JSON.stringify(currentUser))
};

const loginFail = (dispatch, err) => {    
  dispatch({
    type: LOGIN_USER_FAIL,
    data: err
  });
};

//Register
export const register = (
  email,
  password,
  username
) => {
  return dispatch => {
    dispatch({ type: REGISTER_USER });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user =>
        registerSuccess(
          dispatch,
          user,
          email,
          username
        )
      )
      .catch((err) => registerFail(dispatch, err.code));
  };
};

const registerSuccess = (
  dispatch,
  user,
  email,
  username
) => {
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user
  });
  const { currentUser } = firebase.auth();
  const d = new Date().getTime()
  firebase
    .database()
    .ref(`/Users/${currentUser.uid}/`)
    .update({
      uid: currentUser.uid,
      createdAd: d,
      email,
      username
    })
    .catch(error => console.log(error));
};

const registerFail = (dispatch, err) => {
  dispatch({
    type: REGISTER_USER_FAIL,
    data: err
  });
};

//Forgot
export const forgot = email => {
  return dispatch => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(user => forgotSuccess(dispatch, user))
      .catch((err) => forgotFail(dispatch, err.code));
  };
};

const forgotSuccess = (dispatch, user) => {
  dispatch({
    type: FORGOT_USER_SUCCESS,
    payload: user
  });
};

const forgotFail = (dispatch, err) => {
  dispatch({
    type: FORGOT_USER_FAIL,
    data: err
  });
};
