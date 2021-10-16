import { compose } from 'redux';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import TeamsPage from './teams.component';
import { fetchUsersList, fetchTeamsList } from './actions';
import {
  usersListSelector,
  teamsListSelector,
  loadingStateSelector,
  usersSelector,
  teamsSelector
} from './selectors';
import reducer from './reducer';
import saga from './saga';

function mapStateToProps(state) {
  // Get properties from redux state here
  const usersList = usersListSelector(state);
  const teamsList = teamsListSelector(state);
  const isLoading = loadingStateSelector(state);
  const users = usersSelector(state);
  const teams = teamsSelector(state);

  return {
    usersList,
    teamsList,
    isLoading,
    users,
    teams,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsersList: () => dispatch(fetchUsersList()),
    getTeamsList: () => dispatch(fetchTeamsList())
  };
}
const withSaga = injectSaga({ key: 'teamspage', saga });

const withReducer = injectReducer({ key: 'teamspage', reducer });

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  // Put `withReducer` before `withConnect`
  withReducer,
  withSaga,
  withConnect,
)(TeamsPage);
