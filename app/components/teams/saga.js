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


export default function* rootSaga() {
  yield takeEvery(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeEvery(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
}
