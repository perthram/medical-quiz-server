import {
  FETCHING,
  FILE_UPLOADED,
  GET_CATEGORIES,
  GET_FIELDS,
  CLEAR_MESSAGE,
} from '../actions/types';
const initialState = {
  categories: [],
  category: {},
  fields: [],
  message: '',
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILE_UPLOADED:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case FETCHING:
      return {
        ...state,
        loading: true,
        message: '',
      };
    case GET_FIELDS:
      return {
        ...state,
        loading: false,
        fields: action.payload,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: '',
      };
    default:
      return state;
  }
}
