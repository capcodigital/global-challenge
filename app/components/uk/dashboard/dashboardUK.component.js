import React from "react";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "../common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";

const libraries = ["geometry"];

class DashboardUK extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: props.teams,
      value: "",
      isSearchLoading: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.getTeamsList();
  }

  componentWillReceiveProps(nextProps) {
    const { teams } = nextProps;
    this.setState({ teams: teams });
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isSearchLoading: true, value, teams: this.props.teams });

    const filteredResults = this.props.teams.filter((team) =>
      team.name.toLowerCase().includes(value.toLowerCase().trim())
    );

    this.setState({
      isSearchLoading: false,
      teams: filteredResults,
    });
  };

  render() {
    const { teams, value, isSearchLoading } = this.state;
    const { isLoading, error } = this.props;

    let total = teams
      .map((team) => team.totalDistance)
      .reduce((a, b) => a + b, 0);

    return (
      !error && (
        <div className="dashboard">
          <Segment loading={isLoading} className="secondary segment-padding">
            <LoadScript
              googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <MapUK teams={teams} />
            </LoadScript>
          </Segment>
          <Segment loading={isLoading || isSearchLoading} className="secondary">
            <Grid container stackable columns={2} verticalAlign="middle">
              <Grid.Row>
                <Grid.Column>
                  <Header size="large">TEAM LEADERBOARD</Header>
                  <div className="search-container">
                    <Search
                      input={{ icon: "search", iconPosition: "left" }}
                      fluid
                      loading={isSearchLoading}
                      onSearchChange={this.handleSearchChange}
                      value={value}
                      placeholder={"Search Team Name"}
                    />
                  </div>
                  <TeamLeaderboardTable
                    isLoading={isSearchLoading}
                    data={teams}
                    isMainDashboard={true}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Header size="large">SPORTS TOTAL</Header>
                  <Grid container verticalAlign="middle">
                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={runIcon} alt="Run Logo" />
                          Run
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={170}
                          data={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Run"],
                            position: team.activities.runPosition,
                          }))}
                        />
                      </div>
                    </Grid.Row>
                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={cycleIcon} alt="Walk Logo" />
                          Bike
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={170}
                          data={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["CyclingConverted"],
                            position: team.activities.cyclingConvertedPosition,
                          }))}
                        />
                      </div>
                    </Grid.Row>

                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={walkIcon} alt="Walk Logo" />
                          Walk
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={170}
                          data={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Walk"],
                            position: team.activities.walkPosition,
                          }))}
                        />
                      </div>
                    </Grid.Row>

                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={swimIcon} alt="Swim Logo" />
                          Swim
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={90}
                          data={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Swim"],
                            position: team.activities.swimPosition,
                          }))}
                        />{" "}
                      </div>
                    </Grid.Row>
                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={rowIcon} alt="Row Logo" />
                          Row
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={90}
                          data={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Rowing"],
                            position: team.activities.rowingPosition,
                          }))}
                        />
                      </div>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </div>
      )
    );
  }
}

DashboardUK.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
};

export default DashboardUK;
