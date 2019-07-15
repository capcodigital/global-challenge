import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './style.scss';

const svgHeight = 60;
const svgWidth = 350;

// Note: getting width and height from a variable rather than the elements attribute e.g. svg.attr("width")
const margin = {
  top: 20, right: 20, bottom: 30, left: 0
};

const DURATION = 1000;

const numbers = d3.range(10);

/**
 * Component is described here
 */

class Counter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.groupRefs = [];
  }

  componentDidUpdate() {
    const { data } = this.props;

    data.forEach((d, i) => {
      d3.select(this.groupRefs[i])
        .transition()
        .duration(DURATION)
        .attr('transform', `translate(${i * 44}, ${d * -60})`);
    });
  }

  saveRef = (ref) => {
    this.groupRefs = [...this.groupRefs, ref];
  }

  render() {
    const { digits, data } = this.props;

    return (
      <svg height={svgHeight} width={svgWidth}>
        <g transform={`translate(${margin.left}, ${0})`}>
          {data.map((d, i) => (
            <rect
              key={`digit-${i + 0}`}
              className="bar"
              x={i * 44}
              y={0}
              fill={'#fff'}
              width={40}
              height={600}
            />
          ))}

          {
            d3.range(digits).map((digit) => (
              <g
                key={`roll-${digit}`}
                ref={this.saveRef}
                transform={`translate(${digit * 44}, 0)`}
                className={`counter-roll roll-${digit}`}
              >
                {
                  numbers.map((i) => (
                    <text
                      key={`number-${i}`}
                      x={5}
                      y={45 + i * 60}
                    >
                      {i}
                    </text>
                  ))
                }
              </g>
            ))
          }
        </g>
      </svg>
    );
  }
}

Counter.propTypes = {
  digits: PropTypes.number,
  data: PropTypes.array
};

export default Counter;
