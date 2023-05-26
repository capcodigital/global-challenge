import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import worldmap from "./worldmap.svg";

const challengeStartDate = new Date(2023, 4, 26, 0, 0, 0, 0); // 8th November 
const challengeEndDate = new Date(2023, 5, 2, 0, 0, 0, 0); // 22nd November Midnight

function getTimeRemaining() {
  let total = new Date();
  // countdown to the start of the challenge
  if (new Date() <= challengeStartDate)
    total = Date.parse(challengeStartDate) - Date.parse(new Date());
  // countdown during the challenge
  else if (new Date() > challengeStartDate && new Date() < challengeEndDate)
    total = Date.parse(challengeEndDate) - Date.parse(new Date());
  // countdown after the challenge ends
  else if (new Date() > challengeEndDate) total = new Date() - challengeEndDate
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

const CountDown = ({ totalDistance }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <>
      <hr />
      <div
        className="countdown-global"
        style={{ backgroundImage: `url(${worldmap})` }}
      >
        <div className="details">
          <div>{Math.round(totalDistance)}km</div>
          <div>TOTAL DISTANCE</div>
        </div>
        <div className="count">
          <div>
            <span className="days">{timeLeft.days}</span>
            <div className="small-text">DAYS</div>
          </div>
          <div>
            <span className="hours">{timeLeft.hours}</span>
            <div className="small-text">HOURS</div>
          </div>
          <div>
            <span className="minutes">{timeLeft.minutes}</span>
            <div className="small-text">MIN</div>
          </div>
          <div>
            <span className="seconds">{timeLeft.seconds}</span>
            <div className="small-text">SEC</div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

CountDown.propTypes = {
  totalDistance: PropTypes.number,
};

export default CountDown;
