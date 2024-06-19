import axios from 'axios';

export const SERVER_URL = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

// Activities actions
export const FETCH_ACTIVITIES_REQUEST = 'FETCH_ACTIVITIES_REQUEST';
export const FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVIES_SUCCESS';
export const FETCH_ACTIVITIES_ERROR = 'FETCH_ACTIVITIES_ERROR';

export const FILTER_ACTIVITIES_REQUEST = 'FILTER_ACTIVITIES_REQUEST';
export const FILTER_ACTIVITIES_SUCCESS = 'FILTER_ACTIVITIES_SUCCESS';

// Teams actions
export const FETCH_TEAMS_REQUEST = 'FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_ERROR = 'FETCH_TEAMS_ERROR';

// Country actions
export const FETCH_COUNTRY_REQUEST = 'FETCH_COUNTRY_REQUEST';
export const FETCH_COUNTRY_SUCCESS = 'FETCH_COUNTRY_SUCCESS';
export const FETCH_COUNTRY_ERROR = 'FETCH_COUNTRY_ERROR';

// Levels actions
export const FETCH_LEVELS_SUCCESS = 'FETCH_LEVELS_SUCCESS';

// Locations actions
export const FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS';

// Personal actions
export const FETCH_PERSONAL_SUCCESS = 'FETCH_PERSONAL_SUCCESS';

// used by redux-saga
export const fetchTeamsApi = () => axios.get(`${SERVER_URL}teams`).then(({ data }) => data);
export const fetchLevelsApi = () => axios.get(`${SERVER_URL}levels`).then(({ data }) => data);
export const fetchLocationsApi = () => axios.get(`${SERVER_URL}locations`).then(({ data }) => data);
export const fetchPersonalApi = () => axios.get(`${SERVER_URL}users`).then(({ data }) => data);
export const fetchCountryApi = () => axios.get(`${SERVER_URL}countries`).then(({ data }) => data);

// action creators
export const activitiesRecieved = (activities) => ({ type: FETCH_ACTIVITIES_SUCCESS, payload: activities });
export const teamsRecieved = (teamsList) => ({ type: FETCH_TEAMS_SUCCESS, payload: teamsList });
export const levelsRecieved = (levels) => ({ type: FETCH_LEVELS_SUCCESS, payload: levels });
export const locationsRecieved = (locations) => ({ type: FETCH_LOCATIONS_SUCCESS, payload: locations });
export const personalRecieved = (personalList) => ({ type: FETCH_PERSONAL_SUCCESS, payload: personalList });
export const countriesRecieved = (countryList) => ({ type: FETCH_COUNTRY_SUCCESS, payload: countryList });

export const activitiesFailed = (error) => ({ type: FETCH_ACTIVITIES_ERROR, error });
export const teamsFailed = (error) => ({ type: FETCH_TEAMS_ERROR, error });
export const countriesFailed = (error) => ({ type: FETCH_COUNTRY_ERROR, payload: error });

export const filterActivities = (activities) => ({ type: FILTER_ACTIVITIES_REQUEST, payload: activities });

export const filteredActivitiesRecieved = (activities) => ({ type: FILTER_ACTIVITIES_SUCCESS, payload: activities });

export const fetchEmployeeActivities = () => ({ type: FETCH_ACTIVITIES_REQUEST });
export const fetchTeamsList = () => ({ type: FETCH_TEAMS_REQUEST });
export const fetchCountriesList = () => ({ type: FETCH_COUNTRY_REQUEST });
