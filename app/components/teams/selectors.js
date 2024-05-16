import { createSelector } from 'reselect';

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

// Country selectors
const countryListSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("countryList")
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

const countriesSelector = createSelector([countryListSelector], (countryList) => {
  if (countryList) {
    let countriesData = countryList.toJS();

    ["Run", "Walk", /*"Swim", "Rowing",*/ "CyclingConverted", "Yoga"].map(
      (activity) =>
        (countriesData = getPositionByActivity(countriesData, activity))
    );

    return countriesData
      .sort((a, b) => b.totalDistanceConverted - a.totalDistanceConverted)
      .map((country, idx) => ({ ...country, position: idx + 1 }));
  } else [];
}
);

export {
  usersListSelector,
  teamsListSelector,
  loadingStateSelector,
  usersSelector,
  teamsSelector,
  countriesSelector
};
