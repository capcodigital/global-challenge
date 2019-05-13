import React from 'react';
import { range } from 'd3-scale';
import PropTypes from 'prop-types';
import './style.scss';

const svgHeight = 60;
const svgWidth = 260;

// Note: getting width and height from a variable rather than the elements attribute e.g. svg.attr("width")
const margin = {
  top: 20, right: 20, bottom: 30, left: 40
};

/**
 * Component is described here
 */
const Counter = ({ digits, data }) => (
  <svg width={svgWidth} height={svgHeight}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {data.map((d, i) => (
        <rect
          key={`digit-${i + 0}`}
          className="bar"
          x={i * 34}
          y={0}
          fill={'#fff'}
          width={30}
          height={600}
        />
      ))}

      {
      }
    </g>
  </svg>
);

Counter.propTypes = {
  digits: PropTypes.number,
  data: PropTypes.array
};

export default Counter;
