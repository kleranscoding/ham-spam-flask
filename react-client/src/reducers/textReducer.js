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
    case DELETE_TEXT:
      const updatedTextList = state.saved_texts.filter(text=>{
        return text._id !== action._id;
      })
      return {
        ...state,
        saved_texts: updatedTextList,
      };
    default: 
      return state;
  }
}