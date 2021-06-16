import axios from 'axios';

export const SERVER_URL = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';
export const FETCH_TEAMS_REQUEST = 'FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_ERROR = 'FETCH_TEAMS_ERROR';

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

// used by redux-saga
export const fetchUsersApi = () => axios.get(`${SERVER_URL}users/list`).then(({ data }) => data);
export const fetchTeamsApi = () => axios.get(`${SERVER_URL}teams/list`).then(({ data }) => data);

// action creators
export const usersRecieved = (usersList) => ({ type: FETCH_USERS_SUCCESS, payload: usersList });
export const teamsRecieved = (teamsList) => ({ type: FETCH_TEAMS_SUCCESS, payload: teamsList });

export const usersFailed = (error) => ({ type: FETCH_USERS_ERROR, error });
export const teamsFailed = (error) => ({ type: FETCH_TEAMS_ERROR, error });

export const fetchUsersList = () => ({ type: FETCH_USERS_REQUEST });
export const fetchTeamsList = () => ({ type: FETCH_TEAMS_REQUEST });
