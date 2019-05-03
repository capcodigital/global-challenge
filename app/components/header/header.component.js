import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Banner from './images/banner.png';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <img src={Banner} width="200px" alt="Logo" />
        <div className="nav-bar">
          <Link to="/">
            <Button>
              <Icon name="angle down" />
              <FormattedMessage id="homepage.label" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
