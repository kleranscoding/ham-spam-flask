import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import textReducer from './textReducer';

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  profile: textReducer,
});