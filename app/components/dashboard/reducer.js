import { fromJS } from 'immutable';
import {
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_ERROR
} from './actions';

const initialState = fromJS({
  activies: [],
  filteredActivies: [],
  isLoading: false
});

export const getActivies = (state) => state.activies;

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES_REQUEST:
      return { ...state, isLoading: true, error: null };
    case FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activies: action.payload,
        filteredActivies: action.payload,
        isLoading: false,
        error: null
      };
    case FETCH_ACTIVITIES_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return { ...state };
  }
};
