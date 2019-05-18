import { createSelector } from 'reselect';

const getState = (state) => state;

const getActivities = createSelector(
  getState,
  (state) => state.get('dashboard').get('activities')
);

export { getActivities };
