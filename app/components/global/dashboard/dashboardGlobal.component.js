import React from "react";
import { feature } from "topojson-client";
import { keyBy } from "lodash";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import Map from "../map";
import { TeamLeaderboardTable, TeamSportsLeaderboardTable } from "../common";
import LeaderboardTabs from "../leaderboardTabs";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import { allCities, geometries, officeMap } from "./constants";
import "./style.scss";

class DashboardGlobal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      worldData: [],
      height: 600,
      width: 850,
      scale: 50,
      region: [],
      geoCenter: [0, 10],
      filter: "Global",
      cities: allCities,
      statistics: {},
      searchString: "",
      value: "",
      isSearchLoading: false,
      teams: props.teams,
      locations: props.locations,
      levels: props.levels,
      activeTab: "personal",
      currentData: props.teams,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClickTab = this.handleClickTab.bind(this);
  }

  componentDidMount() {
    const { getActivities } = this.props;

    fetch(
      "https://raw.githubusercontent.com/zimrick/react-svg-maps-tutorial/master/public/world-110m.json"
    ).then((response) => {
      if (response.status !== 200) {
        return;
      }
      response.json().then((worldData) => {
        this.setState({
          worldData: feature(worldData, worldData.objects.countries).features,
        });
      });
    });

    this.measure();
    this.getRegion();

    getActivities();
    window.addEventListener("resize", this.measure);
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.getTeamsList();
  }

  componentWillReceiveProps(nextProps) {
    const { breakdown, teams, locations, levels } = nextProps;

    this.setState({
      teams: teams,
      currentData: teams,
      locations: locations,
      levels: levels,
    });
    if (breakdown.offices && breakdown.offices.length) {
      const statistics = keyBy(breakdown.offices, "name");
      this.setState({ statistics });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { width, height, worldData, region } = this.state;

    const { filteredActivities, isLoading } = this.props;

    return (
      width !== nextState.width ||
      height !== nextState.height ||
      worldData !== nextState.worldData ||
      region !== nextState.region ||
      filteredActivities !== nextProps.filteredActivities ||
      isLoading !== nextProps.isLoading
    );
  }

  componentDidUpdate() {
    this.measure();
  }

  getRegion = () => {
    let geoScale = 50;
    let geoCenter = [0, 10];
    const { filter } = this.state;
    const office = officeMap[filter];
    const region =
      filter === "Global"
        ? geometries.features
        : geometries.features.filter(
            (e) =>
              e.properties.region === filter ||
              (office && e.properties.name === office.country)
          );

    if (region.length) {
      const { scale } = region[0];

      if (office) {
        geoScale = scale;
        geoCenter = office.coordinates;
      } else {
        switch (filter) {
          case "North America":
            geoCenter = [-100.5466, 46.073];
            geoScale *= 3;
            break;
          case "Europe":
            geoCenter = [9.1405, 48.6908];
            geoScale *= 5;
            break;
          case "Asia":
            geoCenter = [89.2966, 29.8405];
            geoScale *= 3;
            break;
          default:
            geoCenter = [0, 10];
            geoScale = 50;
        }
      }
    }

    this.setState({
      scale: geoScale,
      geoCenter,
      region,
    });
  };

  saveRef = (ref) => {
    this.containerNode = ref;
  };

  measure = () => {
    const { clientWidth } = this.containerNode;

    this.setState({
      width: clientWidth,
    });
  };

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

  refreshActivies() {
    const { getActivities } = this.props;
    getActivities();
  }

  handleClickTab = (tabName) => {
    const { teams, locations, levels } = this.props;
    switch (tabName) {
      case "personal":
        this.setState({ currentData: teams });
        return this.forceUpdate();
      case "team":
        this.setState({ currentData: teams });
        return this.forceUpdate();
      case "office":
        this.setState({ currentData: locations });
        return this.forceUpdate();
      case "grade":
        this.setState({ currentData: levels });
        return this.forceUpdate();
    }
  };

  render() {
    const {
      currentData,
      cities,
      worldData,
      width,
      height,
      statistics,
      isSearchLoading,
      value,
      activeTab,
    } = this.state;
    const { isLoading, distance, error } = this.props;
    return (
      !error && (
        <div className="dashboard">
          <Segment loading={isLoading} className="secondary segment-padding">
            <div ref={this.saveRef}>
              <Map
                worldData={worldData}
                statistics={statistics}
                cities={cities}
                distance={distance}
                width={width}
                scale={width < 400 ? 70 : 150}
                geoCenter={[0, 10]}
                height={height}
              />
            </div>
          </Segment>
          <Segment loading={isLoading || isSearchLoading} className="secondary">
            <LeaderboardTabs changeTab={this.handleClickTab} />
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
                  {activeTab}
                  <TeamLeaderboardTable
                    isLoading={isSearchLoading}
                    data={currentData}
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
                          data={currentData.map((team) => ({
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
                          data={currentData.map((team) => ({
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
                          data={currentData.map((team) => ({
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
                          data={currentData.map((team) => ({
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
                          data={currentData.map((team) => ({
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

DashboardGlobal.propTypes = {
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

export default DashboardGlobal;
