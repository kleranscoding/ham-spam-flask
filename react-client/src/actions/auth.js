import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import { backURL } from '../validation/constants';

export const registerNewUser = (user, history) => dispatch => {
  axios.post(backURL+'/api/users/register', user)
  .then(res => {
    console.log(res)
    console.log(res.data)
    localStorage.setItem('token', res.data['x-token']);
    dispatch(setCurrentUser(localStorage.getItem('token')));
    history.replace('/');
  })
  .catch(err => {
    console.log(err.response)
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  });
}

export const loginUser = (user, history) => dispatch => {
  axios.post(backURL+'/api/users/login', user)
  .then(res => {
    console.log(res)
    localStorage.setItem('token', res.data['x-token']);
    dispatch(setCurrentUser(localStorage.getItem('token')));
    history.replace('/');
  })
  .catch(err => {
    console.log(err.response)
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  });
}

export const logoutUser = (history) => dispatch => {
  localStorage.removeItem('token');
  dispatch(setCurrentUser({}));
  history.push('/');
}

export const setCurrentUser = token => {
  return {
    type: SET_CURRENT_USER,
    payload: token
  }
}