import {
  all, call, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';
import { keyBy } from 'lodash';
import { delay } from 'redux-saga';
import { allCities } from './constants';


import {
  activitiesRecieved,
  activitiesFailed,
  fetchActivitiesApi,
  filteredActivitiesRecieved,
  FETCH_ACTIVITIES_REQUEST,
  FILTER_ACTIVITIES_REQUEST,
  teamsRecieved,
  teamsFailed,
  fetchTeamsApi,
  fetchLevelsApi,
  fetchLocationsApi,
  fetchPersonalApi,
  FETCH_TEAMS_REQUEST,
  levelsRecieved,
  locationsRecieved,
  personalRecieved
} from './actions';
import { getActivies } from './reducer';


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
    const [teamsList, locations, levels, personalList] = yield all([
      call(fetchTeamsApi),
      call(fetchLocationsApi),
      call(fetchLevelsApi),
      call(fetchPersonalApi)
    ])
    yield all([
      put(teamsRecieved(teamsList)),
      put(locationsRecieved(locations)),
      put(levelsRecieved(levels)),
      put(personalRecieved(personalList))
    ])
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

export default function* rootSaga() {
  yield takeEvery(FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga);
  yield takeLatest(FILTER_ACTIVITIES_REQUEST, filterActivitiesSaga);
  yield takeEvery(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
}
