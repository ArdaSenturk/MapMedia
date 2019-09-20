import * as firebase from "firebase";
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
} from "./type";

export const post = (post, locationDetail, userInfo) => {
  return dispatch => {
    dispatch({ type: POST });
    firebase.database().ref(`/Post/${(parseFloat(locationDetail.lat).toString().replace('.', ''))}${(parseFloat(locationDetail.lng).toString().replace('.', ''))}`).update({ locationDetail, channelId: `${(parseFloat(locationDetail.lat).toString().replace('.', ''))}${(parseFloat(locationDetail.lng).toString().replace('.', ''))}` })
    .then(() => {
      let d = new Date()
      firebase.database().ref(`/Post/${(parseFloat(locationDetail.lat).toString().replace('.', ''))}${(parseFloat(locationDetail.lng).toString().replace('.', ''))}/Posts/${d.getTime()}`).update({ post, id: d.getTime(),userInfo })
    })
    .then((val) => postSuccess(dispatch, val))
    .catch((err) => postFail(dispatch, err))
  };
};

const postSuccess = (dispatch, val) => {
  dispatch({
    type: POST_SUCCESS,
    data: val
  });
};

const postFail = (dispatch, err) => {
  dispatch({
    type: POST_FAIL,
    data: err
  });
};

export const getPost = () => {
  return dispatch => {
    dispatch({ type: GET_POST });
    firebase.database().ref(`/Post`).once("value", snap => {
      if (snap.val()) {
        getPostSuccess(dispatch, snap.val())
      } else {
        getPostFail(dispatch)
      }
    })
  }
}

const getPostSuccess = (dispatch, val) => {
  dispatch({
    type: GET_POST_SUCCESS,
    data: val
  });
};

const getPostFail = (dispatch, err) => {
  dispatch({
    type: GET_POST_FAIL,
  });
};

export const getPostDetail = (id) => {
  return dispatch => {
    dispatch({ type: GET_POSTS });
    firebase.database().ref(`/Post/${id}/Posts`).on("value", snap => {
      if (snap.val()) {
        getPostsSuccess(dispatch, snap.val())
      } else {
        getPostsFail(dispatch)
      }
    })
  }
}

const getPostsSuccess = (dispatch, val) => {
  dispatch({
    type: GET_POSTS_SUCCESS,
    data: val
  });
};

const getPostsFail = (dispatch, err) => {
  dispatch({
    type: GET_POSTS_FAIL,
  });
};


export const sendMessage = ({channelId, id, post, userInfo}) => {
  return dispatch => {
    dispatch({ type: SEND_POST });
    firebase.database().ref(`/Post/${channelId}/Posts/${id}/`).update({ id, post, userInfo })
    .then(() => sendPostsSuccess(dispatch)).catch((err) => sendPostsFail(dispatch, err))
  }
}

const sendPostsSuccess = (dispatch) => {
  dispatch({ 
    type: SEND_POST_SUCCESS
   })
}

const sendPostsFail = (dispatch) => {
  dispatch({ 
    type: SEND_POST_FAIL
   })
}