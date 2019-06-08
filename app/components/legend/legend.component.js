import React from 'react';
import PropTypes from 'prop-types';

const height = 100;

const Legend = ({ legends }) => (
  <div className="legends">
    <svg height={height || 50}>
      {
        legends.map((d, i) => (
          <g key={d.label} transform={`translate(${i * 150},${50 + 15})`}>
            <rect
              y={0}
              x={0}
              width={30}
              height={5}
              style={{ fill: d.fill }}
            />

            <text x={33.5} y={5}>
              {d.label}
            </text>
          </g>
        ))
      }
    </svg>
  </div>
);


Legend.propTypes = {
  legends: PropTypes.array,
  height: PropTypes.number
};

export default Legend;
