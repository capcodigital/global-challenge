import React from "react";
import PropTypes from "prop-types";
import worldmap from "./worldmap.svg";

const TeamPageHeader = ({ totalDistance, teamName }) => {
  return (
    <div>
      <hr className="team" />
      <div
        className="countdown-global team"
        style={{ backgroundImage: `url(${worldmap})` }}
      >
        <div className="details">
          <div>{teamName}</div>
          <div>TEAM</div>
        </div>
        <div className="details distance">
          <div>{totalDistance}km</div>
          <div>TOTAL DISTANCE</div>
        </div>
      </div>
      <hr className="team" />
    </div>
  );
};

TeamPageHeader.propTypes = {
  totalDistance: PropTypes.number,
  teamName: PropTypes.string,
};

export default TeamPageHeader;
