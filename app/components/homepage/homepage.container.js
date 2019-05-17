import { connect } from 'react-redux';
import { SAMPLE_DATA } from './actions';
import { getValue } from './selectors';
import Homepage from './homepage.component';

function mapStateToProps(state) {
  // Get properties from redux state here
  const value = getValue(state);

  return { value };
}

function mapDispatchToProps(dispatch) {
  return {
    sampleDispatch: (value) => {
      // Calls redux action
      dispatch({
        type: SAMPLE_DATA,
        value
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
