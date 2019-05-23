import { fromJS } from 'immutable';
import { FETCH_ACTIVITIES_REQUEST, FETCH_ACTIVITIES_SUCCESS, FETCH_ACTIVITIES_ERROR } from './actions';

const initialState = fromJS({
  activities: [],
  filteredActivies: [],
  isLoading: false
});

export const getActivies = (state) => state.activies;

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
    default:
      return state;
  }
};
