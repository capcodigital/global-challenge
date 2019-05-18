import axios from 'axios';

export const SERVER_URL = 'http://localhost:8082/';

export const FETCH_ACTIVITIES_REQUEST = 'FETCH_ACTIVITIES_REQUEST';
export const FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVIES_SUCCESS';
export const FETCH_ACTIVITIES_ERROR = 'FETCH_ACTIVITIES_ERROR';

export const FILTER_ACTIVITIES = 'FILTER_ACTIVITIES';
export const FILTER_CHANGED = 'FILTER_CHANGED';

// used by standard redux
export const fetchActivities = () => (dispatch) => {
  axios
    .get(`${SERVER_URL}user/activities`)
    .then(({ data }) => dispatch({ type: FETCH_ACTIVITIES_SUCCESS, payload: data }));
};

// used by redux-saga
export const fetchActivitiesApi = () => axios.get(`${SERVER_URL}user/activities`).then(({ data }) => data);

// action creators
export const activitiesRecieved = (activities) => ({ type: FETCH_ACTIVITIES_SUCCESS, payload: activities });

export const activitiesFailed = (error) => ({ type: FETCH_ACTIVITIES_ERROR, error });

export const filterActivities = (filteredActivies) => ({ type: FILTER_ACTIVITIES, payload: filteredActivies });

export const fetchEmployeeActivities = () => ({ type: FETCH_ACTIVITIES_ERROR });
