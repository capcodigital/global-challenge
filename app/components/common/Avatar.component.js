import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

export const getInitials = (name) => {
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

const hasFlag = (location) => {

  // if (!location) return false;

  // const img = new Image();
  // img.url = "./images/" + location + ".png";
  // if (img.complete) {
  //   return true;
  // } else {
    return false;
  // }
} 

const Avatar = ({ name, location, color, size }) => (
  <svg className="avatar" width={size} height={size}>
    <circle fill={color} cx={size / 2} cy={size / 2} r={size / 2} />
    {hasFlag(location) && (
     <img src={"./images/" + location + ".png"} alt="Country Flag" />
    )}
    {!hasFlag(location) && (
    <text
      textAnchor="middle"
      x={size / 2}
      y={size / 2 + 5}
      fill="white"
      fontSize="15"
      fontFamily="Helvetica"
    >
      {getInitials(name)}
    </text>
    )}
  </svg>

);

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default Avatar;
