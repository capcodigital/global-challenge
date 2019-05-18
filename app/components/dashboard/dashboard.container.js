import { connect } from 'react-redux';
import { FETCH_ACTIVITIES_REQUEST } from './actions';
import Dashboard from './dashboard.component';
import { getActivities } from './selectors';

function mapStateToProps(state) {
  // Get properties from redux state here
  const activities = getActivities(state);

  return { activities };
}

function mapDispatchToProps(dispatch) {
  return {
    getActivitiesDispatch: () => {
      // Calls redux action
      dispatch({
        type: FETCH_ACTIVITIES_REQUEST
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
