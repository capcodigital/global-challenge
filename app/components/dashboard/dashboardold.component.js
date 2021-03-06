import React from "react";
import { feature } from "topojson-client";
import { keyBy, debounce } from "lodash";
import PropTypes from "prop-types";
import {
  Segment,
  Grid,
  Container,
  Image,
  Header,
  Dropdown,
  Search,
} from "semantic-ui-react";
import {
  FormattedMessage,
  FormattedNumber,
  FormattedHTMLMessage,
} from "react-intl";
import { Counter, ListView } from "components/common";
import Map from "components/map";
import Sign from "components/sign";
import Legend from "components/legend";
import convertNumberToArray from "../../utils/covertNumberToArray";

import { offices, allCities, geometries, officeMap } from "./constants";
import Logo from "./images/capco.png";
import "./style.scss";

const legends = [
  { label: "Planned route", fill: "rgb(0, 88, 187)" },
  { label: "Progress so far", fill: "rgb(192, 13, 13)" },
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      worldData: [],
      height: 450,
      width: 850,
      scale: 50,
      region: [],
      geoCenter: [0, 10],
      filter: "Global",
      cities: allCities,
      statistics: {},
      searchString: "",
    };
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
  }

  componentWillReceiveProps(nextProps) {
    const { breakdown } = nextProps;
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

  onCountryChange = (e, { value }) => {
    const { filterActivities } = this.props;

    this.setState({ filter: value }, () => {
      this.getRegion();
      filterActivities(value, "region");
    });
  };

  refreshActivies() {
    const { getActivities } = this.props;
    getActivities();
  }

  render() {
    const {
      cities,
      worldData,
      width,
      height,
      filter,
      region,
      geoCenter,
      scale,
      statistics,
      searchString,
    } = this.state;

    const {
      isLoading,
      total,
      average,
      breakdown,
      leaderboard,
      distance,
    } = this.props;

    return (
      <div className="dashboard">
        <Segment loading={isLoading} className="secondary">
          <Container>
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

              <Legend legends={legends} />
            </div>

            <div className="challenge-description">
              <FormattedHTMLMessage
                id="dashboard.mapDescription"
                defaultMessage="Track our collective progress as we take <span class='highlight'>50 million steps</span> for charity; from Sao Paulo to Hong Kong via all <span class='highlight'>{numberOfOffices} Offices.</span> Help us all reach the finish and get stepping!"
                values={{
                  numberOfOffices: cities.length + 1,
                }}
              />
            </div>
          </Container>
        </Segment>

        <Segment loading={isLoading} className="primary">
          <Container className="sign-wrapper">
            <Sign className="counter-wrapper">
              <div className="counter">
                <div className="logo-container">
                  <Image src={Logo} size="small" />
                </div>
                <div className="counter-container">
                  <Counter
                    digits={8}
                    data={convertNumberToArray(total, 10000000)}
                  />
                </div>
              </div>

              <div className="tagline">
                <FormattedMessage id="dashboard.counterTagline" />
              </div>
            </Sign>
          </Container>
          <Grid container stackable columns={3} divided verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <div className="content-container">
                  <Header className="container-header">
                    <FormattedMessage id="dashboard.locations" />
                  </Header>
                  <Dropdown
                    placeholder="Select an office"
                    selection
                    fluid
                    value={filter}
                    options={offices}
                    onChange={this.onCountryChange}
                  />

                  <div className="map-container">
                    <Map
                      worldData={region}
                      width={300}
                      height={240}
                      scale={scale}
                      geoCenter={geoCenter}
                      cities={[]}
                    />
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="content-container">
                  <Header size="medium" className="container-header">
                    <FormattedMessage id="dashboard.averageStepsByOffice" />
                  </Header>

                  <div>
                    <ListView
                      className={"scrolling"}
                      list={breakdown.averages}
                      prefix="Average no of steps"
                      dataKey="average"
                      image
                    />
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="content-container">
                  <Header size="medium" className="container-header">
                    <FormattedMessage id="dashboard.leaderboard" />
                  </Header>

                  <div className="search-container">
                    <Search
                      fluid
                      loading={isLoading}
                      onResultSelect={this.handleResultSelect}
                      onSearchChange={debounce(this.handleSearchChange, 500, {
                        leading: true,
                      })}
                      results={leaderboard}
                      value={searchString}
                    />
                  </div>
                  <div>
                    <ListView list={leaderboard} prefix={"No. of steps"} />
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium" className="container-header">
                    <FormattedMessage id="dashboard.stepsByOffice" />
                  </Header>

                  <div>
                    <ListView
                      className={"scrolling"}
                      list={breakdown.offices}
                      prefix={"No of steps"}
                      image
                    />
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="content-container">
                  <Header size="medium" className="container-header">
                    <FormattedMessage id="dashboard.stepsByLevel" />
                  </Header>

                  <div>
                    <ListView
                      list={breakdown.levels}
                      prefix="No of steps"
                      image
                    />
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="content-container">
                  <Sign>
                    <Header as="h4" className="container-header">
                      <FormattedMessage id="dashboard.average" />
                    </Header>
                    <div className="stats-container">
                      <div className="number">
                        <FormattedNumber value={average} />
                      </div>
                      <div className="label">
                        <FormattedMessage id="dashboard.steps" />
                      </div>
                    </div>
                  </Sign>
                </div>
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
