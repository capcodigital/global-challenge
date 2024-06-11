import React from "react";
import { feature } from "topojson-client";
import { keyBy } from "lodash";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Search } from "semantic-ui-react";
import Map from "../map";
import {
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
  CountDown,
  PersonalLeaderboardTable,
  CountryLeaderboardTable,
} from "../common";
import LeaderboardTabs from "../leaderboardTabs";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import { allCities, geometries, officeMap } from "./constants";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

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
      country: props.country,
      locations: props.locations,
      levels: props.levels,
      personal: props.personal,
      activeTab: "personal",
      currentData: props.personal,
      filteredData: props.personal,
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
    const { breakdown, teams, locations, levels, personal, country } = nextProps;

    this.setState({
      teams: teams,
      currentData: personal,
      filteredData: personal,
      locations: locations,
      levels: levels,
      personal: personal,
      country: country,
    });
    if (breakdown.offices && breakdown.offices.length) {
      const statistics = keyBy(breakdown.offices, "name");
      this.setState({ statistics });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      width,
      height,
      worldData,
      region,
      value,
      filteredData,
      currentData,
    } = this.state;

    const { filteredActivities, isLoading } = this.props;

    return (
      width !== nextState.width ||
      height !== nextState.height ||
      worldData !== nextState.worldData ||
      region !== nextState.region ||
      value !== nextState.value ||
      filteredData !== nextState.filteredData ||
      currentData !== nextState.currentData ||
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
    e.preventDefault();
    if (value) {
    this.setState({
        ...this.state,
      isSearchLoading: true,
      value,
      filteredData: this.state.currentData,
      }, () => this.filterSearchResult());
    } else {
      this.setState({
        ...this.state,
        value,
        filteredData: this.state.currentData,
      });
    }
  };

  filterByCountry = (values) => {
    const { currentData } = this.state;
    if (values.length) {
      const filteredItems = currentData.filter((data) => {
        const countryLocation = data.country;
        return values.includes(countryLocation);
      });
      this.setState({ filteredData: filteredItems });
    } else {
      this.setState({ filteredData: currentData });
    }
  }

  filterByCity = (values) => {
    const { currentData } = this.state;
    if (values.length) {
      const filteredItems = currentData.filter((data) => {
        const cityLocation = data.location;
        return values.includes(cityLocation);
      });
      this.setState({ filteredData: filteredItems });
    } else {
      this.setState({ filteredData: currentData });
    }
  }

  filterSearchResult = () => {
    const { currentData, value } = this.state;

    const filteredResults = currentData.filter((data) => {
      const name = data.name.toLowerCase();
      const newSearchValue = value.toLowerCase().trim();
      return name.includes(newSearchValue);
    });

    this.setState({
      isSearchLoading: false,
      filteredData: filteredResults,
    });
  };

  refreshActivies() {
    const { getActivities } = this.props;
    getActivities();
  }

  handleClickTab = (tabName) => {
    const { teams, locations, levels, personal, country } = this.props;
    switch (tabName) {
      case "personal":
        this.setState({
          currentData: personal,
          filteredData: personal,
          activeTab: "personal",
        });
        return this.forceUpdate();
      case "office":
        this.setState({
          currentData: locations,
          filteredData: locations,
          activeTab: "office",
        });
        return this.forceUpdate();
      case "team":
        this.setState({
          currentData: teams,
          filteredData: teams,
          activeTab: "team",
        });
        return this.forceUpdate();
      case "country":
        this.setState({
          userData: personal,
          currentData: country,
          filteredData: country,
          activeTab: "country",
        });
        return this.forceUpdate();
      default:
        this.setState({
          currentData: personal,
          filteredData: personal,
          activeTab: "personal",
        });
        return this.forceUpdate();
    }
  };

  render() {
    const {
      currentData,
      filteredData,
      cities,
      worldData,
      width,
      height,
      statistics,
      isSearchLoading,
      value,
      activeTab,
      teams,
      personal,
      country,
      userData,
    } = this.state;
    const { isLoading, distance, error } = this.props;
    let totalOverallDistance = personal
      .map((team) => team.totalDistance)
      .reduce((a, b) => a + b, 0);

    return (
      !error && (
        <div className="dashboard">
          <Segment loading={isLoading} className="secondary segment-padding">
            <Grid container stackable columns={1}>
              <Grid.Row>
                <CountDown totalDistance={totalOverallDistance} />
              </Grid.Row>
              <Grid.Row>
                <div ref={this.saveRef}>
                  <Map
                    worldData={worldData}
                    statistics={statistics}
                    cities={cities}
                    distance={totalOverallDistance}
                    width={width}
                    scale={width < 400 ? 70 : 150}
                    geoCenter={[0, 10]}
                    height={height}
                  />
                </div>
              </Grid.Row>
            </Grid>
          </Segment>
          <Segment loading={isLoading || isSearchLoading} className="secondary">
            <LeaderboardTabs changeTab={this.handleClickTab} />
            <Grid container stackable columns={2} verticalAlign="middle">
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header size="large" className="global-header">
                    LEADERBOARDS
                  </Header>
                  <div className={`search-container ${challenge_name}`}>
                    <Search
                      input={{ icon: "search", iconPosition: "left" }}
                      fluid
                      loading={isSearchLoading}
                      onSearchChange={this.handleSearchChange}
                      value={value}
                      placeholder={"Search Name"}
                    />
                  </div>
                  { activeTab === 'personal' ? <PersonalLeaderboardTable data={filteredData} filterByCountry={this.filterByCountry} filterByCity={this.filterByCity}/>
                    : <CountryLeaderboardTable isLoading={isSearchLoading} data={filteredData} userData={userData} isMainDashboard={activeTab === "country"} activeTab={activeTab} />
                  }
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header size="large" className="global-header">
                    SPORTS TOTAL
                  </Header>
                  <Grid container verticalAlign="middle">
                    <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={runIcon} alt="Run Logo" />
                          Run
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={170}
                          data={filteredData}
                          activity={"Run"}
                          activityPosition={"runPosition"}
                          activeTab={activeTab}
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
                          data={filteredData}
                          activity={"Walk"}
                          activityPosition={"walkPosition"}
                          activeTab={activeTab}
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
                          data={filteredData}
                          activity={"Cycling"}
                          activityPosition={"cyclingPosition"}
                          activeTab={activeTab}
                        />
                      </div>
                    </Grid.Row>
                    {/* <Grid.Row>
                      <div className="content-container-dashboard">
                        <Header size="medium" className="container-header">
                          <img src={swimIcon} alt="Swim Logo" />
                          Swim
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={90}
                          data={filteredData.map((team) => ({
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
                          data={filteredData.map((team) => ({
                            name: team.name,
                            distance: team.activities["Rowing"],
                            position: team.activities.rowingPosition,
                          }))}
                        />
                      </div>
                    </Grid.Row> */}
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
