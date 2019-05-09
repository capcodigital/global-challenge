import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container } from 'semantic-ui-react';
import Logo from './images/capco.png';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <Menu borderless secondary pointing size="small">
          <Container>
            <Menu.Item>
              <Link to="/">
                <img src={Logo} width="100px" alt="Logo" />
              </Link>
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    );
  }
}

export default Header;
