import {
  call, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';

import { delay } from 'redux-saga';

import {
  activitiesRecieved,
  activitiesFailed,
  filterActivities,
  fetchActivitiesApi,

  FILTER_CHANGED,
  FETCH_ACTIVITIES_REQUEST,
} from './actions';
import { getActivies } from './reducer';

export function* fetchActivitiesSaga() {
  try {
    const activities = yield call(fetchActivitiesApi);
    yield put(activitiesRecieved(activities));
  } catch (error) {
    yield put(activitiesFailed(error));
  }
}

export function* filterActivitiesSaga({ location }) {
  yield call(delay, 500);

  const searchLocation = location.toLowerCase().trim();
  const activities = yield select(getActivies);
  const filteredActivities = activities.filter((activity) => activity.location.toLowerCase().includes(searchLocation));
  yield put(filterActivities(filteredActivities));
}

export default function* rootSaga() {
  yield takeEvery(FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga);
  yield takeLatest(FILTER_CHANGED, filterActivitiesSaga);
}
