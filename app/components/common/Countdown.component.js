import React, { useEffect, useState } from "react";

const challengeStartDate = new Date(2021, 5, 21, 0, 0, 0, 0); // 21st June
const challengeEndDate = new Date(2021, 5, 28, 0, 0, 0, 0); // 28th June

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

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="clockdiv">
      <div>
        <span className="days">{timeLeft.days}</span>
        <div className="smalltext">DAYS</div>
      </div>
      <div>
        <span className="hours">{timeLeft.hours}</span>
        <div className="smalltext">HOURS</div>
      </div>
      <div>
        <span className="minutes">{timeLeft.minutes}</span>
        <div className="smalltext">MIN</div>
      </div>
      <div>
        <span className="seconds">{timeLeft.seconds}</span>
        <div className="smalltext">SEC</div>
      </div>
    </div>
  );
};

export default Countdown;
