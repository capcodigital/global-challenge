import { compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Dashboard from './dashboard.component';
import { filterActivities, fetchEmployeeActivities } from './actions';
import {
  filteredActivitiesSelector,
  loadingStateSelector,
  activitiesSelector,
  breakdownSelector,
  totalStepSelector,
  averageSelector,
  leaderboardSelector,
  totalDistanceSelector
} from './selectors';
import reducer from './reducer';
import saga from './saga';

function mapStateToProps(state) {
  // Get properties from redux state here
  const activities = activitiesSelector(state);
  const isLoading = loadingStateSelector(state);
  const filteredActivities = filteredActivitiesSelector(state);
  const breakdown = breakdownSelector(state);
  const total = totalStepSelector(state);
  const average = averageSelector(state);
  const distance = totalDistanceSelector(state);
  const leaderboard = leaderboardSelector(state);

  return {
    activities,
    filteredActivities,
    leaderboard,
    isLoading,
    breakdown,
    distance,
    total,
    average
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActivities: () => dispatch(fetchEmployeeActivities()),
    filterActivities: (query, type) => dispatch(filterActivities({ query, type }))
  };
}
const withSaga = injectSaga({ key: 'dashboard', saga });

const withReducer = injectReducer({ key: 'dashboard', reducer });

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  // Put `withReducer` before `withConnect`
  withReducer,
  withSaga,
  withConnect,
)(Dashboard);
