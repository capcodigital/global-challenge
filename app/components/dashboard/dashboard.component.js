import React from "react";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "components/common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";

const libraries = ["geometry"];

class Dashboard extends React.Component {
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
          <Segment loading={isLoading} className="secondary">
            <div className="counter-uk">
              <div className="wrapper">
                <span className="text">Overal Distance: </span>
                <span className="total">{total}km</span>
              </div>
            </div>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <MapUK teams={teams} />
            </LoadScript>
          </Segment>
          <Segment loading={isLoading || isSearchLoading} className="primary">
            <Grid container stackable columns={2} verticalAlign="middle">
              <Grid.Row>
                <Grid.Column>
                  <Header size="large">Team Leaderboard</Header>
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
                  <Header size="large">Sports Total</Header>
                  <Grid container stackable columns={2} verticalAlign="middle">
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <div className="content-container-dashboard">
                          <Header size="medium" className="container-header">
                            <img src={runIcon} alt="Run Logo" />
                            Run
                          </Header>
                          <TeamSportsLeaderboardTable
                            height={290}
                            data={teams.map((team) => ({
                              name: team.name,
                              distance: team.activities["Run"],
                              position: team.activities.runPosition,
                            }))}
                          />
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div className="content-container-dashboard">
                          <Header size="medium" className="container-header">
                            <img src={cycleIcon} alt="Walk Logo" />
                            Bike
                          </Header>
                          <TeamSportsLeaderboardTable
                            height={290}
                            data={teams.map((team) => ({
                              name: team.name,
                              distance: team.activities["Cycling"],
                              position: team.activities.cyclingPosition,
                            }))}
                          />
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <div className="content-container-dashboard">
                          <Grid.Row>
                            <Header size="medium" className="container-header">
                              <img src={walkIcon} alt="Walk Logo" />
                              Walk
                            </Header>
                            <TeamSportsLeaderboardTable
                              height={250}
                              data={teams.map((team) => ({
                                name: team.name,
                                distance: team.activities["Walk"],
                                position: team.activities.walkPosition,
                              }))}
                            />
                          </Grid.Row>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div className="content-container-dashboard">
                          <Grid.Row style={{ paddingBottom: 20 }}>
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
                            />
                          </Grid.Row>
                          <Grid.Row>
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
      )
    );
  }
}

Dashboard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
};

export default Dashboard;
