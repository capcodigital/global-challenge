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

  return (
    <footer className={`footer ${blue}`}>
      <Container className="footer-container">
        <div className="copyright-container">
          <p>
            You can download the Fitbit or Strava app from the{" "}
            <a href="https://apps.apple.com/us/app/fitbit-health-fitness/id462638897">
              Apple
            </a>{" "}
            or{" "}
            <a href="https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en_GB&gl=US">
              Google
            </a>{" "}
            store | If you need support, please email the{" "}
            <a href="mailto:3cd19d49.capco.com@apac.teams.ms">
              Global Challenge Team
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
