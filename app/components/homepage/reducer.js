import { fromJS } from 'immutable';
import { SAMPLE_DATA } from './actions';

// Initial routing state
const initialState = fromJS({
  sample_data: null,
});

function homepage(state = initialState, action) {
  switch (action.type) {
    case SAMPLE_DATA: {
      const { value } = action;
      return state.merge({ value });
    }
    default: {
      return state;
    }
  }
}

export default homepage;
