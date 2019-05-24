import axios from 'axios';

export const SERVER_URL = 'https://localhost:8080/';

export const FETCH_ACTIVITIES_REQUEST = 'FETCH_ACTIVITIES_REQUEST';
export const FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVIES_SUCCESS';
export const FETCH_ACTIVITIES_ERROR = 'FETCH_ACTIVITIES_ERROR';

export const FILTER_ACTIVITIES_REQUEST = 'FILTER_ACTIVITIES_REQUEST';
export const FILTER_ACTIVITIES_SUCCESS = 'FILTER_ACTIVITIES_SUCCESS';

// used by standard redux
export const fetchActivities = () => (dispatch) => {
  axios
    .get(`${SERVER_URL}users/activities`)
    .then(({ data }) => dispatch({ type: FETCH_ACTIVITIES_SUCCESS, payload: data }));
};

// used by redux-saga
export const fetchActivitiesApi = () => axios.get(`${SERVER_URL}users/activities`).then(({ data }) => data);

// action creators
export const activitiesRecieved = (activities) => ({ type: FETCH_ACTIVITIES_SUCCESS, payload: activities });

export const activitiesFailed = (error) => ({ type: FETCH_ACTIVITIES_ERROR, error });

export const filterActivities = (activities) => ({ type: FILTER_ACTIVITIES_REQUEST, payload: activities });

export const filteredActivitiesRecieved = (activities) => ({ type: FILTER_ACTIVITIES_SUCCESS, payload: activities });

export const fetchEmployeeActivities = () => ({ type: FETCH_ACTIVITIES_REQUEST });
