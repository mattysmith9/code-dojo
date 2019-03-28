import { PROFILE_LOADING } from '../actions/types';
import { GET_PROFILES } from '../actions/types';
import { GET_PROFILE } from '../actions/types';
import { CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
  loading: false,
  profiles: null,
  profile: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };
    default:
      return state;
  }
}
