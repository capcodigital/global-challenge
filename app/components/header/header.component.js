import React from "react";
import { Link } from "react-router-dom";
import { Menu, Container, Button } from "semantic-ui-react";
import Logo from "./images/capco.png";
import GlobalChallenge from "./images/global-challenge-full.png";
import "./style.scss";

class Header extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <Menu borderless secondary size="small">
          <Container>
            <Menu.Item>
              <Link to="/">
                <img src={Logo} width="100px" alt="Logo" />
                <img
                  src={GlobalChallenge}
                  width="180px"
                  alt="Globa Challenge Logo"
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
            <Menu.Item>
              <Button
                secondary
                fluid
                as="a"
                href="/faq"
                className="donate-button-header"
              >
                FAQ
              </Button>
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    );
  }
}

export default Header;
