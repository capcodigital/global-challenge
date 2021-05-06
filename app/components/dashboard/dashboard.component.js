import React from "react";
import { keyBy, debounce } from "lodash";
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
      results: [],
      isLoading: false,
    };
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    const { getTeamsList } = this.props;
    getTeamsList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  componentWillReceiveProps(nextProps) {
    const { teams } = nextProps;

    this.setState({ teams: teams });
  }
  handleResultSelect = (e, { result }) => {
    let res = this.state.teams.filter((team) => team.name === result.name);
    console.log(res);
    this.setState({ value: result.name, teams: res });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value, teams: this.props.teams });

    setTimeout(() => {
      const filteredResults = this.props.teams.filter((team) =>
        team.name.toLowerCase().includes(value.toLowerCase())
      );

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 300);

    console.log(this.state.value);
  };

  render() {
    const { teams, value, results, isLoading } = this.state;

    let total = teams
      .map((team) => team.totalDistance)
      .reduce((a, b) => a + b, 0);

    const resRender = ({ name }) => <span key="name">{name}</span>;

    return (
      <div className="dashboard">
        <Segment className="secondary">
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
        <Segment className="primary">
          <Grid container stackable columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Header size="large">Team Leaderboard</Header>
                <div className="search-container">
                  <Search
                    input={{ icon: "search", iconPosition: "right" }}
                    fluid
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={this.handleSearchChange}
                    results={results}
                    value={value}
                    placeholder={"Search Team Name"}
                    resultRenderer={resRender}
                  />
                </div>
                <TeamLeaderboardTable
                  height={580}
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

Dashboard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  breakdown: PropTypes.object,
  leaderboard: PropTypes.array,
  filterActivities: PropTypes.func.isRequired,
};

export default Dashboard;
