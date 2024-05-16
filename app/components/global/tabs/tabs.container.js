import { compose } from "redux";
import { connect } from "react-redux";
import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import Tabs from "./tabs.component";
import { fetchCountriesList } from "../dashboard/actions";
import { countriesSelector } from "../dashboard/selectors";
import reducer from "../dashboard/reducer";
import saga from "../dashboard/saga";

function mapStateToProps(state) {
  const country = countriesSelector(state);
  return {
    country,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTeamsList: () => dispatch(fetchCountriesList()),
  };
}
const withSaga = injectSaga({ key: "dashboard", saga });

const withReducer = injectReducer({ key: "dashboard", reducer });

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withReducer, withSaga, withConnect)(Tabs);
