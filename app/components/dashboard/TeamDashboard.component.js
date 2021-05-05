import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "components/common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import { Icon } from "semantic-ui-react";
import "./style.scss";

class TeamDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statistics: {},
      searchString: "",
    };
  }

  componentDidMount() {
    const { getTeamsList } = this.props;
    getTeamsList();
  }

  shouldComponentUpdate(nextProps) {
    const { isLoading } = this.props;
    return isLoading !== nextProps.isLoading;
  }

  render() {
    const { isLoading, teams } = this.props;

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
            googleMapsApiKey={"AIzaSyDj6Xw-eqeq8cHxo4LB6Sn3wqLqiM7E_k8"}
            libraries={["geometry"]}
          >
            <MapUK teams={teams} />
          </LoadScript>
        </Segment>
        <Segment loading={isLoading} className="primary">
          <Grid container stackable columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Link to="/progress" className="back-link">
                  <Icon name="angle left"  />
                  Back to leaderboard
                </Link>

                <Header size="large">Team Leaderboard</Header>
                <div className="team-distance">Team Distance: {250}km</div>
                <TeamLeaderboardTable
                  height={580}
                  data={teams}
                  mainDashboard={false}
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
                          teams={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Run"],
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
                          teams={teams.map((team) => ({
                            name: team.name,
                            distance: team.activities["Cycling"],
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
                            teams={teams.map((team) => ({
                              name: team.name,
                              distance: team.activities["Walk"],
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
                            teams={teams.map((team) => ({
                              name: team.name,
                              distance: team.activities["Swim"],
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
                            teams={teams.map((team) => ({
                              name: team.name,
                              distance: team.activities["Rowing"],
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
    );
  }
}

TeamDashboard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  breakdown: PropTypes.object,
  leaderboard: PropTypes.array,
  filterActivities: PropTypes.func.isRequired,
};

export default TeamDashboard;
