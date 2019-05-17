import React from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import PropTypes from 'prop-types';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      city: {}
    };
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
  }

  handleCityClick = (cityIndex) => {
    const { cities } = this.props;
    const city = cities[cityIndex];
  }

  getArc = (d, s) => {
    const dx = d.destination.x - d.origin.x;
    const dy = d.destination.y - d.origin.y;
    const dr = Math.sqrt(dx * dx + dy * dy);
    const spath = !s ? ' 0 0,0 ' : ' 0 0,1 ';
    return `M${d.origin.x},${d.origin.y}A${dr},${dr}${spath}${d.destination.x},${d.destination.y}`;
  }

  getRoute = (city, i) => {
    const { cities } = this.props;

    const source = cities[i];
    const destination = cities[i + 1];

    const sourcePosition = this.projection()(source.coordinates);
    const destinationPosition = destination ? this.projection()(destination.coordinates) : destination;

    const connection = [sourcePosition, destinationPosition];

    if (destination) {
      const d = {
        origin: { x: connection[0][0], y: connection[0][1] },
        destination: { x: connection[1][0], y: connection[1][1] }
      };
      const s = d.destination.x > d.origin.x;

      return this.getArc(d, s);
    }
    return '';
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
          {
            cities.map((office, i) => (
              <path
                key={`route-${i + 0}`}
                d={this.getRoute(office, i)}
                className="route-path"
                fill="none"
                stroke="#4682b4"
              />
            ))
          }
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
