import { createSelector } from 'reselect';

const getState = (state) => state;

const getValue = createSelector(
  getState,
  (state) => state.get('homepage').get('value')
);

export { getValue };
