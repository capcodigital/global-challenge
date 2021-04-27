/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

const getInitials = (name) => {
  let temp = name
    .replace(/\bthe\b|\band\b/gi, "")
    .split(" ")
    .filter((e) => e);

  if (temp.length === 1) return temp[0].charAt(0).toUpperCase();
  else
    return `${
      temp[0].charAt(0) + temp[temp.length - 1].charAt(0)
    }`.toUpperCase();
};

const Avatar = ({ teamName, color, size }) => (
  <svg className="avatar" width={size} height={size}>
    <circle fill={color} cx={size / 2} cy={size / 2} r={size / 2} />
    <text
      textAnchor="middle"
      x={size / 2}
      y={size / 2 + 5}
      fill="white"
      fontSize="15"
      fontFamily="Helvetica"
    >
      {getInitials(teamName)}
    </text>
  </svg>
);

Avatar.propTypes = {
  teamName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default Avatar;
