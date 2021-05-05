import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Icon } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "components/common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";
const libraries = ["geometry"];

class TeamDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {},
    };
  }

  componentDidMount() {
    const { getTeamsList } = this.props;
    getTeamsList();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.setState({
      teamName: window.location.pathname
        .split("/progress/team/")[1]
        .replace("-", " "),
    });
  }

  shouldComponentUpdate(nextProps) {
    const { isLoading } = this.props;
    return isLoading !== nextProps.isLoading;
  }

  render() {
    const { isLoading, teams } = this.props;

    let team = teams.filter(
      (team) => team.name.toLowerCase() === this.state.teamName
    );
    
    team[0] && console.log(team[0]);
    let total = teams
      .map((team) => team.totalDistance)
      .reduce((a, b) => a + b, 0);

    return team[0] ? (
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
            libraries={libraries}
          >
            <MapUK teams={teams} />
          </LoadScript>
        </Segment>
        <Segment loading={isLoading} className="primary">
          <Grid container stackable columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Link to="/progress" className="back-link">
                  <Icon name="angle left" />
                  Back to leaderboard
                </Link>

                <Header size="large">{team[0].name}</Header>
                <div className="team-distance">Team Distance: {250}km</div>
                <TeamLeaderboardTable
                  height={580}
                  data={team[0].members}
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
    ) : null;
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
