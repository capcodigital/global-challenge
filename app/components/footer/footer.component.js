import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import "./style.scss";

function Footer() {
  const [blue, setBlue] = useState(null);
  const blueFooterPages = ["about", "event-rules", "how-to", "faq"];
  const location = useLocation();
  const colorFooter = () => {
    return blueFooterPages.includes(location.pathname.substring(1)) ? "blue" : null;
  };

  useEffect(() => {
    setBlue(colorFooter());
  }, [location]);

  const challenge_name = process.env.CHALLENGE_NAME
      ? `${process.env.CHALLENGE_NAME}`
      : "global";

  return (
    <footer className={`footer ${blue} ${challenge_name}`}>
      <Container className="footer-container">
        <div className="copyright-container">
          <p>
            You can download the Fitbit app (<a href="https://apps.apple.com/us/app/fitbit-health-fitness/id462638897">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en_GB&gl=US"> Android</a>) or Strava app (<a href="https://apps.apple.com/us/app/strava-run-ride-swim/id426826309">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.strava&hl=en_GB&gl=US"> Android</a>) | If you need support, please email the <a href="mailto:3cd19d49.capco.com@apac.teams.ms"> UK Challenge Team </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
