import React from "react";
import { keyBy, debounce } from "lodash";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import { FormattedMessage } from "react-intl";
import {
  ResizableListView,
  TeamLeaderboardTable,
  MapUK,
} from "components/common";
import { LoadScript } from "@react-google-maps/api";
import "./style.scss";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 450,
      width: 850,
      statistics: {},
      searchString: "",
    };
  }

  componentDidMount() {
    const { getTeamsList } = this.props;
    getTeamsList();
  }

  componentWillReceiveProps(nextProps) {
    const { breakdown } = nextProps;

    if (breakdown.offices && breakdown.offices.length) {
      const statistics = keyBy(breakdown.offices, "name");
      this.setState({ statistics });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { isLoading } = this.props;
    return isLoading !== nextProps.isLoading;
  }

  handleResultSelect = (e, { result }) => {
    const { filterActivities } = this.props;

    this.setState({ searchString: result.title }, () => {
      filterActivities(result.title);
    });
  };

  handleSearchChange = (e, { value }) => {
    const { filterActivities } = this.props;

    this.setState({ searchString: value }, () => {
      filterActivities(value);
    });
  };

  render() {
    const { searchString } = this.state;
    const { isLoading, leaderboard, teams } = this.props;

    let total = teams
      .map((team) => team.totalDistance)
      .reduce((a, b) => a + b, 0);

    return (
      <div className="dashboard">
        <Segment loading={isLoading} className="secondary">
          <div className="counter-uk">
            <div className="wrapper">
              <span className="text">Overal Distance: </span>
              <span className="total">{total}km</span>
            </div>
          </div>
          <LoadScript
            // googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            googleMapsApiKey={'AIzaSyDj6Xw-eqeq8cHxo4LB6Sn3wqLqiM7E_k8'}
            libraries={['geometry']}
          >
            <MapUK teams={teams} />
          </LoadScript>
        </Segment>

        <Segment loading={isLoading} className="primary">
          <Grid container stackable columns={2} divided verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Grid.Row>
                  <div className="content-container-search">
                    <Header size="medium" className="container-header">
                      Team/User Search
                    </Header>
                    <div className="search-container">
                      <Search
                        input={{ icon: "search", iconPosition: "left" }}
                        fluid
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={debounce(this.handleSearchChange, 500, {
                          leading: true,
                        })}
                        results={leaderboard}
                        value={searchString}
                        placeholder={"Search Team Name"}
                      />
                    </div>
                    <div>
                      <ResizableListView height={160} className={"scrolling"} />
                    </div>
                  </div>
                  <div className="content-container-leaderboard">
                    <Header size="medium" className="container-header">
                      <FormattedMessage id="dashboard.teamLeaderboard" />
                    </Header>
                    <TeamLeaderboardTable
                      height={450}
                      className={"scrolling"}
                      teams={teams}
                    />
                  </div>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <Header
                  className="container-header"
                  style={{ textAlign: "center", paddingTop: "1rem" }}
                >
                  Sports Total
                </Header>
                <Grid
                  container
                  stackable
                  columns={2}
                  divided
                  verticalAlign="middle"
                >
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Grid.Row>
                        <div className="content-container-dashboard">
                          <Header size="medium" className="container-header">
                            Run
                          </Header>
                          <ResizableListView
                            height={290}
                            className={"scrolling"}
                          />
                        </div>
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Grid.Row>
                        <div className="content-container-dashboard">
                          <Header size="medium" className="container-header">
                            Bike
                          </Header>
                          <ResizableListView
                            height={290}
                            className={"scrolling"}
                          />
                        </div>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Grid.Row>
                        <div className="content-container-dashboard">
                          <Header size="medium" className="container-header">
                            Walk
                          </Header>
                          <ResizableListView
                            height={290}
                            className={"scrolling"}
                          />
                        </div>
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <div className="content-container-dashboard">
                        <Grid.Row>
                          <Header size="medium" className="container-header">
                            Swim
                          </Header>
                          <ResizableListView
                            height={140}
                            className={"scrolling"}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Header size="medium" className="container-header">
                            Row
                          </Header>
                          <ResizableListView
                            height={140}
                            className={"scrolling"}
                          />
                        </Grid.Row>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

Dashboard.propTypes = {
  filteredActivities: PropTypes.object,
  getActivities: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  total: PropTypes.number,
  distance: PropTypes.number,
  average: PropTypes.number,
  breakdown: PropTypes.object,
  leaderboard: PropTypes.array,
  filterActivities: PropTypes.func.isRequired,
};

export default Dashboard;
