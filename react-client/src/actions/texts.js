import axios from 'axios';
import { FETCH_TEXTS, DELETE_TEXT, GET_ERRORS } from './types';
import { backURL } from '../validation/constants';

export const fetchTexts = (config) => dispatch => {
  axios.get(backURL+'/api/users/profile',config)
    .then(res => {
      dispatch(receivedTexts(res.data.data.username, res.data.data.saved_texts));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteText = (textId, config) => dispatch => {
  axios.delete(backURL+'/api/text/'+textId,config)
    .then(res => {
      dispatch(deletedText(res.data.data._id));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

const receivedTexts = (username, saved_texts) => {
  return {
    type: FETCH_TEXTS,
    payload: { username: username, saved_texts: saved_texts }
  }
};

const deletedText = (textId) => {
  return {
    type: DELETE_TEXT,
    _id: textId,
  }
};