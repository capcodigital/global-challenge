import { compose } from "redux";
import { connect } from "react-redux";
import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import Tabs from "./tabs.component";
import { fetchTeamsList } from "../dashboard/actions";
import { teamsSelector } from "../dashboard/selectors";
import reducer from "../dashboard/reducer";
import saga from "../dashboard/saga";

function mapStateToProps(state) {
  const teams = teamsSelector(state);
  return {
    teams,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTeamsList: () => dispatch(fetchTeamsList()),
  };
}
const withSaga = injectSaga({ key: "dashboard", saga });

const withReducer = injectReducer({ key: "dashboard", reducer });

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withReducer, withSaga, withConnect)(Tabs);
