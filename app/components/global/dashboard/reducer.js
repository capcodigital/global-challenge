import { fromJS } from "immutable";
import {
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_ERROR,
  FILTER_ACTIVITIES_SUCCESS,
  FILTER_ACTIVITIES_REQUEST,
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_ERROR,
  FETCH_LEVELS_SUCCESS,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_PERSONAL_SUCCESS,
  FETCH_COUNTRY_REQUEST,
  FETCH_COUNTRY_SUCCESS,
  FETCH_COUNTRY_ERROR
} from "./actions";

const initialState = fromJS({
  activities: [],
  teamsList: [],
  filteredActivities: [],
  isLoading: false,
  teamName: "",
  levels: [],
  locations: [],
  personalList: [],
  countryList: []
});

export const getTeams = (state) => state.get("dashboard").get("teamsList");

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_ACTIVITIES_SUCCESS:
      return state.merge({
        activities: action.payload,
        filteredActivities: action.payload,
        isLoading: false,
        error: null,
      });
    case FETCH_ACTIVITIES_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    case FILTER_ACTIVITIES_SUCCESS:
      return state.merge({
        filteredActivities: action.payload,
        isLoading: false,
      });
    case FILTER_ACTIVITIES_REQUEST:
      return state.merge({
        isLoading: true,
      });
    case FETCH_TEAMS_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_TEAMS_SUCCESS:
      return state.merge({
        teamsList: action.payload,
        error: null,
        isLoading: false,
      });
    case FETCH_COUNTRY_REQUEST:
      return state.merge({ isLoading: true, error: null });
    case FETCH_COUNTRY_SUCCESS:
      return state.merge({
        countryList: action.payload,
        error: null,
        isLoading: false,
      });
    case FETCH_COUNTRY_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    case FETCH_LEVELS_SUCCESS:
      return state.merge({
        levels: action.payload,
        error: null,
        isLoading: false,
      });
    case FETCH_LOCATIONS_SUCCESS:
      return state.merge({
        locations: action.payload,
        isLoading: false,
        error: null,
      });
      case FETCH_PERSONAL_SUCCESS:
        return state.merge({
          personalList: action.payload,
          error: null,
          isLoading: false,
        });
    case FETCH_TEAMS_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    default:
      return state;
  }
};
