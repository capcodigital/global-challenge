import React from "react";
import { Link } from "react-router-dom";
import { Menu, Container, Button, Icon } from "semantic-ui-react";
import ESTRChallenge from "./images/estr-challenge-full.png";
import ESTRChallengeMobile from "./images/estr-mobile-logo.png";
import "./style.scss";

class Header extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <>
        <div className="mobile-header">
          <Menu borderless secondary size="small">
            <Container className="mobile-container">
              <Menu.Item>
                <Button
                  secondary
                  fluid
                  className="hamburger-menu"
                  onClick={() =>
                    this.props.setSidebarVisible(
                      (prevSidebarVisible) => !prevSidebarVisible
                    )
                  }
                >
                  <Icon name="bars" className="hamburger-icon" />
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  secondary
                  fluid
                  as="a"
                  href="/register"
                  className="mobile-button-header"
                >
                  Register
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
          <div>
            <img src={ESTRChallengeMobile} alt="ESTR Challenge Logo" />
          </div>
        </div>
        <div className="header">
          <Menu borderless secondary size="small">
            <Container>
              <Menu.Item>
                <Link to="/">
                  <img
                    src={ESTRChallenge}
                    alt="ESTR Challenge Logo"
                    className="global-challenge-logo"
                  />
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Button
                  secondary
                  fluid
                  as="a"
                  href="/register"
                  className="donate-button-header"
                >
                  Register
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  secondary
                  fluid
                  as="a"
                  href="https://give.roomtoread.org/campaign/capco-active-for-education/c186488"
                  target="_blank"
                  className="donate-button-header"
                >
                  Donate
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
        </div>
      </>
    );
  }
}

export default Header;
