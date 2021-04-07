import { createSelector } from 'reselect';
import { keyBy, cloneDeep } from 'lodash';

const getState = (state) => state;

const usersListSelector = createSelector(
  getState,
  (state) => state.get('teamspage').get('usersList')
);

const loadingStateSelector = createSelector(
  getState,
  (state) => state.get('teamspage').get('isLoading')
);

const teamsListSelector = createSelector(
  getState,
  (state) => state.get('teamspage').get('teamsList')
);

const usersSelector = createSelector(
  [usersListSelector],
  (usersList) => {
    if (usersList) {
      return usersList.toJS();
    }
    return [];
  }
);

const teamsSelector = createSelector(
  [teamsListSelector],
  (teamsList) => {
    if (teamsList) {
      return teamsList.toJS();
    }
    return [];
  }
);

export {
  usersListSelector,
  teamsListSelector,
  loadingStateSelector,
  usersSelector,
  teamsSelector
};
