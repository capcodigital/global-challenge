import { fromJS } from 'immutable';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_ERROR,
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_ERROR,
  FETCH_COUNTRY_REQUEST,
  FETCH_COUNTRY_SUCCESS,
  FETCH_COUNTRY_ERROR,
} from './actions';

const initialState = fromJS({
  usersList: [],
  teamsList: [],
  countryList: [],
  isLoading: false
});

export const getUsers = (state) => state.get('teamspage').get('usersList');

export const getTeams = (state) => state.get('teamspage').get('teamsList');

export const getCountry = (state) => state.get('teamspage').get('countryList');

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_USERS_SUCCESS:
      return state.merge({
        usersList: action.payload,
        isLoading: false,
        error: null
      });
    case FETCH_USERS_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    case FETCH_TEAMS_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_TEAMS_SUCCESS:
      return state.merge({
        teamsList: action.payload,
        isLoading: false,
        error: null
      });
    case FETCH_TEAMS_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
      case FETCH_COUNTRY_REQUEST:
        return state.merge({ isLoading: true, error: null });
      case FETCH_COUNTRY_SUCCESS:
        return state.merge({
          teamsList: action.payload,
          isLoading: false,
          error: null
        });
      case FETCH_COUNTRY_ERROR:
        return state.merge({ isLoading: false, error: action.payload });
    default:
      return state;
  }
};
