import React, { useEffect, useState } from "react";
import { Button, Icon } from "semantic-ui-react";

const challengeStartDate = new Date(2021, 8, 1, 0, 0, 0, 0); // 1th September
const challengeEndDate = new Date(2021, 9, 1, 0, 0, 0, 0); // 31th September Midnight

function getTimeRemaining() {
  let total = new Date();
  if (new Date() <= challengeStartDate)
    total = Date.parse(challengeStartDate) - Date.parse(new Date());
  else if (new Date() > challengeStartDate || new Date() < challengeEndDate)
    total = Date.parse(challengeEndDate) - Date.parse(new Date());
  else if (new Date() > challengeEndDate) total = Date.parse(new Date(0, 0, 0));
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

const Countdown = ({ overallDistance }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className={`countdown ${!open && "closed"}`}>
      {(window.location.pathname === "/" ||
        window.location.pathname.includes("/team")) && (
        <Icon
          name="close"
          className="close-icon"
          onClick={() => setOpen(!open)}
        />
      )}

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
      <div className="distance-label">Overall distance</div>
      <div className="distance">
        {overallDistance.toFixed(0)}
        <div>km</div>
      </div>
      <div>
        <Button
          secondary
          fluid
          as="a"
          href="https://uk.virginmoneygiving.com/CapcoUKCSR1"
          target="_blank"
          className="count-btn"
        >
          Donate
        </Button>
        <Button secondary fluid as="a" href="/register" className="count-btn">
          Register
        </Button>
      </div>
    </div>
  );
};

export default Countdown;
