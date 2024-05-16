import axios from 'axios';

export const SERVER_URL = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';
export const FETCH_TEAMS_REQUEST = 'FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_ERROR = 'FETCH_TEAMS_ERROR';
export const FETCH_COUNTRY_REQUEST = 'FETCH_COUNTRY_REQUEST';
export const FETCH_COUNTRY_SUCCESS = 'FETCH_COUNTRY_SUCCESS';
export const FETCH_COUNTRY_ERROR = 'FETCH_COUNTRY_ERROR';

// used by standard redux
export const fetchUsers = () => (dispatch) => {
  axios
    .get(`${SERVER_URL}users/list`)
    .then(({ data }) => dispatch({ type: FETCH_USERS_SUCCESS, payload: data }));
};

// used by standard redux
export const fetchTeams = () => (dispatch) => {
  axios
    .get(`${SERVER_URL}teams/list`)
    .then(({ data }) => dispatch({ type: FETCH_TEAMS_SUCCESS, payload: data }));
};

// used by standard redux
export const fetchCountries = () => (dispatch) => {
  axios
    .get(`${SERVER_URL}country/list`)
    .then(({ data }) => dispatch({ type: FETCH_COUNTRY_SUCCESS, payload: data }));
};

// used by redux-saga
export const fetchUsersApi = () => axios.get(`${SERVER_URL}users/list`).then(({ data }) => data);
export const fetchTeamsApi = () => axios.get(`${SERVER_URL}teams/list`).then(({ data }) => data);
export const fetchCountryApi = () => axios.get(`${SERVER_URL}country/list`).then(({ data }) => data);

// action creators
export const usersRecieved = (usersList) => ({ type: FETCH_USERS_SUCCESS, payload: usersList });
export const teamsRecieved = (teamsList) => ({ type: FETCH_TEAMS_SUCCESS, payload: teamsList });
export const countryRecieved = (countryList) => ({ type: FETCH_COUNTRY_SUCCESS, payload: countryList });

export const usersFailed = (error) => ({ type: FETCH_USERS_ERROR, error });
export const teamsFailed = (error) => ({ type: FETCH_TEAMS_ERROR, error });
export const countryFailed = (error) => ({ type: FETCH_COUNTRY_ERROR, error });

export const fetchUsersList = () => ({ type: FETCH_USERS_REQUEST });
export const fetchTeamsList = () => ({ type: FETCH_TEAMS_REQUEST });
export const fetchCountryList = () => ({ type: FETCH_COUNTRY_REQUEST });
