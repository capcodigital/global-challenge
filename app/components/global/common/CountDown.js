import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import worldmap from "./worldmap.svg";

const challengeStartDate = new Date(2023, 6, 17, 0, 0, 0, 0);
const challengeEndDate = new Date(2023, 7, 7, 9, 0, 0, 0);

function getTimeRemaining() {
  let total = new Date();
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let days = 0;

  // countdown to the start of the challenge
  if (new Date() <= challengeStartDate) {
    total = Date.parse(challengeStartDate) - Date.parse(new Date());
    seconds = Math.floor((total / 1000) % 60);
    minutes = Math.floor((total / 1000 / 60) % 60);
    hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    days = Math.floor(total / (1000 * 60 * 60 * 24));
  // countdown during the challenge
  } else if (new Date() > challengeStartDate && new Date() < challengeEndDate) {
    total = Date.parse(challengeEndDate) - Date.parse(new Date());
    seconds = Math.floor((total / 1000) % 60);
    minutes = Math.floor((total / 1000 / 60) % 60);
    hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    days = Math.floor(total / (1000 * 60 * 60 * 24));
  }
  
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
        {/*
        <div className="count">
          <div>
              <span className="days">LIVE!</span>
              <div className="small-text">CHALLENGE CURRENTLY IN PROGRESS</div>
          </div>
        </div>
        */}
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
