import React from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import PropTypes from 'prop-types';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      city: {}
    };

    this.handleCountryClick = this.handleCountryClick.bind(this);
    this.handleCityClick = this.handleCityClick.bind(this);
    this.projection = this.projection.bind(this);
  }

  projection = () => {
    const {
      width, height, geoCenter, scale
    } = this.props;

    return geoMercator()
      .center(geoCenter)
      .scale(scale)
      .translate([width / 2, height / 2]);
  }

  handleCountryClick = (countryIndex) => {
    const { worldData } = this.props;
    const country = worldData[countryIndex];
    console.log(country);
  }

  handleCityClick = (cityIndex) => {
    const { cities } = this.props;
    const city = cities[cityIndex];
    this.setState({
      city
    });
  }

  render() {
    const {
      worldData, cities, width, height
    } = this.props;

    return (
      <svg width={width} height={height || 450}>
        <g className="countries">
          {
            worldData.map((d, i) => (
              <path
                key={`path-${i + 0}`}
                d={geoPath().projection(this.projection())(d)}
                className="country"
                fill={`rgba(38,50,36,${1 / worldData.length * (i + 1)})`}
                stroke="#fff"
                strokeWidth={0.5}
                onClick={() => this.handleCountryClick(i)}
              />
            ))
          }
        </g>
        <g className="markers">
          {
            cities.map((city, i) => (
              <circle
                key={`marker-${i + 0}`}
                cx={this.projection()(city.coordinates)[0]}
                cy={this.projection()(city.coordinates)[1]}
                r={(city.steps || 3000000) / 3000000}
                fill="#e91e63"
                opacity={0.7}
                onClick={() => this.handleCityClick(i)}
              />
            ))
          }
        </g>

        <g className="routes">

        </g>
      </svg>
    );
  }
}

Map.propTypes = {
  worldData: PropTypes.array.isRequired,
  cities: PropTypes.array.isRequired,
  geoCenter: PropTypes.array.isRequired,
  scale: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number
};

export default Map;
