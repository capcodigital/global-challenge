import React from 'react';
import { feature } from 'topojson-client';
import {
  Segment, Grid, Container, Image, Header, Dropdown
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import {
  offices, allCities, geometries, officeMap
} from './constants';
import Map from '../map/map.component';
import Sign from '../sign/sign.component';
import './style.scss';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      worldData: [],
      height: 450,
      width: 850,
      scale: 50,
      region: [],
      geoCenter: [0, 10],
      filter: 'Global',
      cities: allCities,
    };
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/zimrick/react-svg-maps-tutorial/master/public/world-110m.json')
      .then((response) => {
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
    window.addEventListener('resize', this.measure);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      width, height, worldData, region
    } = this.state;

    return width !== nextState.width || height !== nextState.height || worldData !== nextState.worldData || region !== nextState.region;
  }

  componentDidUpdate() {
    this.measure();
  }

  getRegion = () => {
    let geoScale = 50;
    let geoCenter = [0, 10];
    const { filter } = this.state;
    const office = officeMap[filter];
    const region = filter === 'Global' ? geometries.features : geometries.features.filter((e) => e.properties.region === filter || (office && e.properties.name === office.country));

    if (region.length) {
      const { scale } = region[0];

      if (office) {
        geoScale = scale;
        geoCenter = office.coordinates;
      } else {
        switch (filter) {
          case 'North America':
            geoCenter = [-100.5466, 46.0730];
            geoScale *= 3;
            break;
          case 'Europe':
            geoCenter = [9.1405, 48.6908];
            geoScale *= 5;
            break;
          case 'Asia':
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
      region
    });
  }

  saveRef = (ref) => {
    this.containerNode = ref;
  }

  measure = () => {
    const { clientWidth } = this.containerNode;

    this.setState({
      width: clientWidth,
    });
  }

  handleCountryChange = (e, { value }) => {
    this.setState({ filter: value }, () => {
      this.getRegion();
    });
  }

  render() {
    const {
      cities, worldData, width, height, filter, region, geoCenter, scale
    } = this.state;

    console.log(scale, geoCenter);
    return (
      <div>
        <Container>
          <div ref={this.saveRef}>
            <Map
              worldData={worldData}
              cities={cities}
              width={width}
              scale={150}
              geoCenter={[0, 10]}
              height={height}
            />
          </div>
        </Container>

        <Segment className="primary dashboard">
          <Grid container stackable columns={3} divided verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium">Locations</Header>
                  <Dropdown
                    placeholder="Select an office"
                    selection
                    fluid
                    value={filter}
                    options={offices}
                    onChange={this.handleCountryChange}
                  />

                  <div className="map-container">
                    <Map
                      worldData={region}
                      width={300}
                      height={200}
                      scale={scale}
                      geoCenter={geoCenter}
                      cities={[]}
                    />
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium">Steps by Office</Header>
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium">Steps by Level</Header>
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium">Leaderboard</Header>
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="content-container">
                  <Sign>
                    <Header as="h4">
                      <FormattedMessage id="dashboard.average" />
                    </Header>
                    <div className="stats-container">
                      <div className="number">{ 0 }</div>
                      <div className="label"><FormattedMessage id="dashboard.steps" /></div>
                    </div>
                  </Sign>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="content-container">
                  <Header size="medium">Top Net Contributors</Header>
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default Dashboard;
