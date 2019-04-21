import { FETCH_TEXTS, DELETE_TEXT } from '../actions/types';

const initialState = {
  username: "",
  saved_texts: [],
};

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_TEXTS:
      return {
        ...state,
        username: action.payload.username,
        saved_texts: action.payload.saved_texts,
      };
    default: 
      return state;
  }
}