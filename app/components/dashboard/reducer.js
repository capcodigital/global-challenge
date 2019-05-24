import { fromJS } from 'immutable';
import {
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_ERROR,
  FILTER_ACTIVITIES_SUCCESS,
  FILTER_ACTIVITIES_REQUEST
} from './actions';

const initialState = fromJS({
  activities: [],
  filteredActivies: [],
  isLoading: false
});

export const getActivies = (state) => state.get('dashboard').get('activities');

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_ACTIVITIES_SUCCESS:
      return state.merge({
        activities: action.payload,
        filteredActivities: action.payload,
        isLoading: false,
        error: null
      });
    case FETCH_ACTIVITIES_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    case FILTER_ACTIVITIES_SUCCESS:
      return state.merge({
        filteredActivities: action.payload,
        isLoading: false
      });
    case FILTER_ACTIVITIES_REQUEST:
      return state.merge({
        isLoading: true
      });
    default:
      return state;
  }
};
