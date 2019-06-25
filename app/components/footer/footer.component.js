import React from 'react';
import { Container } from 'semantic-ui-react';
import './style.scss';

class Footer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <footer className="footer">
        <Container className="footer-container">
          <div className="copyright-container">
            <p>
              Need help or support? Please contact the <a href="mailto:3cd19d49.capco.com@apac.teams.ms"> Global Challenge Team</a> via email
            </p>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
