import {
  call, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';
import { keyBy } from 'lodash';
import { delay } from 'redux-saga';
import { allCities } from './constants';


import {
  activitiesRecieved,
  activitiesFailed,
  fetchActivitiesApi,
  filteredActivitiesRecieved,
  filteredTeamsRecieved,
  FETCH_ACTIVITIES_REQUEST,
  FILTER_ACTIVITIES_REQUEST,
  teamsRecieved,
  teamsFailed,
  fetchTeamsApi,
  FETCH_TEAMS_REQUEST,
  FILTER_TEAMS_REQUEST
} from './actions';
import { getActivies, getTeams } from './reducer';


const officeByRegion = keyBy(allCities, 'region');
const officeByCity = keyBy(allCities, 'name');

const filterData = (data, payload, searchString) => data.filter((activity) => {
  if (payload.type === 'region') {
    const office = activity.get('location');
    const location = officeByRegion[payload.query] ? officeByCity[office] && officeByCity[office].region.toLowerCase() : office && office.toLowerCase();
    return location && location.includes(searchString);
  }

  const name = activity.get('name');

  return name && name.toLowerCase().includes(searchString);
}).toJS();

export function* fetchActivitiesSaga() {
  try {
    const activities = yield call(fetchActivitiesApi);
    yield put(activitiesRecieved(activities));
  } catch (error) {
    yield put(activitiesFailed(error));
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

export function* filterActivitiesSaga({ payload }) {
  yield call(delay, 200);

  if (payload && payload.query) {
    const searchString = payload.query.toLowerCase().trim();
    const activities = yield select(getActivies);

    if (activities) {
      const filteredActivities = payload.query === 'Global' ? activities : filterData(activities, payload, searchString);

      yield put(filteredActivitiesRecieved(filteredActivities));
    }
  }
}

export function* filterTeamsSaga({ payload }) {
  yield call(delay, 200);

  if (payload && payload.query != "") {
    const searchString = payload.query.toLowerCase().trim();
    const teams = yield select(getTeams);

    if (teams) {
      const filteredTeams = payload.query === 'Global' ? teams : filterData(teams, payload, searchString);

      yield put(filteredTeamsRecieved(filteredTeams));
    }
  } else {
    const teams = yield select(getTeams);
    yield put(filteredTeamsRecieved(teams));
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga);
  yield takeLatest(FILTER_ACTIVITIES_REQUEST, filterActivitiesSaga);
  yield takeEvery(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeEvery(FILTER_TEAMS_REQUEST, filterTeamsSaga);
}
