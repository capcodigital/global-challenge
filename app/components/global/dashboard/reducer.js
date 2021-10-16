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
} from "./actions";

const initialState = fromJS({
  activities: [],
  teamsList: [],
  filteredActivities: [],
  isLoading: false,
  teamName: "",
  levels: [],
  locations: [],
});

export const getActivies = (state) => state.get("dashboard").get("activities");

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
    case FETCH_TEAMS_ERROR:
      return state.merge({ isLoading: false, error: action.payload });
    default:
      return state;
  }
};
