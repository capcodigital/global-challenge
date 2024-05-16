import {
  call, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';
import { keyBy } from 'lodash';
import { delay } from 'redux-saga';

import {
  usersRecieved,
  teamsRecieved,
  usersFailed,
  teamsFailed,
  fetchUsersApi,
  fetchTeamsApi,
  FETCH_USERS_REQUEST,
  FETCH_TEAMS_REQUEST,
  FETCH_COUNTRY_REQUEST,
  fetchCountryApi,
  countriesRecieved
} from './actions';
import { getUsers, getTeams } from './reducer';

export function* fetchUsersSaga() {
  try {
    const usersList = yield call(fetchUsersApi);
    yield put(usersRecieved(usersList));
  } catch (error) {
    yield put(usersFailed(error));
  }
}

export function* fetchTeamsSaga() {
  try {
    const teamsList = yield call(fetchTeamsApi);
    yield put(teamsRecieved(teamsList));
  } catch (error) {
    yield put(teamsFailed(error));
  }
}

export function* fetchCountrySaga() {
  try {
    const countryList = yield call(fetchCountryApi);
    yield put(countriesRecieved(countryList));
  } catch (error) {
    yield put(countriesRecieved(error));
  }
}


export default function* rootSaga() {
  yield takeEvery(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeEvery(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeEvery(FETCH_COUNTRY_REQUEST, fetchTeamsSaga);
}
