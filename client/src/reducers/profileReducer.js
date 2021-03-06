import { GET_PROFILES, PROFILE_LOADING } from '../actions/types';

const initialState = {
  profiles: null,
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
