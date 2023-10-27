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

const getFlag = (location, size) => {
  const locationLabel = location.replaceAll(".", "");

  try {
    const imgUrl = require("../../images/" + locationLabel + ".png");
    const imageStyle = {
      "background-image": `url(${imgUrl})`,
      "width": size,
      "height": size,
    };
    return <div className="flag-img-cropper" style={imageStyle} />;
  } catch (err) {
    return false;
  }
};

const Avatar = ({ name, activeTab, color, size }) => {
  const locationFlag = getFlag(name, size);

  return (
    <>
      {activeTab === "office" && name && locationFlag}
      {(activeTab !== "office" || !locationFlag) && name && (
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
            {getInitials(name)}
          </text>
        </svg>
      )}
    </>
  );
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default Avatar;
