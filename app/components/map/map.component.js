import React from 'react';
import { geoMercartor, geoPath } from 'd3-geo';
import PropTypes from 'prop-types';
import { feature } from 'topojson-client';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      office: {}
    };

    this.handleCountryClick = this.handleCountryClick.bind(this);
    this.handleCityClick = this.handleCityClick.bind(this);
  }

  projection = () => geoMercartor()
    .scale(100)
    .translate([800 / 2, 450 / 2])

  handleCountryClick = (countryIndex) => {
    const { worldData } = this.props;
    const country = worldData[countryIndex];
    console.log(country);
  }

  handleCityClick = (cityIndex) => {
    const { cities } = this.props;
    const city = cities[cityIndex];
    console.log(city);
  }

  render() {
    const { worldData, cities } = this.props;
    return (
      <svg width={800} height={450} viewBox="0 0 800 450">
        <g className="countries">
          {
            worldData.map((d, i) => (
              <path
                key={`path-${i + 0}`}
                d={geoPath().projection(this.projection())(d)}
                className="country"
                fill={`rgba(38,50,36,${1 / worldData.length * i})`}
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
                r={city.steps / 3000000}
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
  cities: PropTypes.array
};

export default Map;
