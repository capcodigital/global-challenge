import React from "react";
import { Menu, Container, Button, Icon } from "semantic-ui-react";
import ESTRChallenge from "./images/uk-challenge-logo.png";
import ESTRChallengeMobile from "./images/estr-mobile-logo.png";
import GlobalChallenge from "./images/JN_5157_Global Challenge Campaign_logo_2024_02.png";
import "./style.scss";

class Header extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const challenge_name = process.env.CHALLENGE_NAME
      ? `${process.env.CHALLENGE_NAME}`
      : "global";
    return (
      <>
        <div className={`mobile-header white-button`}>
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
                  <Icon
                    name="bars"
                    className={`hamburger-icon ${challenge_name}`}
                  />
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  secondary
                  fluid
                  as="a"
                  href="/register"
                  className={`mobile-button-header white-button`}
                >
                  Register
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
          <div className={`mobile-logo ${challenge_name}`}>
            {challenge_name == "global" && (
              <img src={GlobalChallenge} alt="ESTR Challenge Logo" />
            )}
            {challenge_name == "uk" && (
              <img src={ESTRChallengeMobile} alt="ESTR Challenge Logo" />
            )}
          </div>
        </div>
        <div className="header">
          <Menu borderless secondary size="small">
            <Container>
              <Menu.Item>
                <a
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  {challenge_name == "global" && (
                    <img
                      src={GlobalChallenge}
                      alt="Global Challenge Logo"
                      className="global-challenge-logo"
                    />
                  )}
                  {challenge_name == "uk" && (
                    <img
                      src={ESTRChallenge}
                      alt="Challenge Logo"
                      className="uk-challenge-logo"
                    />
                  )}
                </a>
              </Menu.Item>
              {window.location.pathname === "/register" ? (
                <>
                  <Menu.Item>
                    {/*<Button
                      secondary
                      fluid
                      size="large"
                      as="a"
                      href="/teams/register"
                      className={`button-header white-button`}
                    >
                      Teams
                    </Button>*/}
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      secondary
                      fluid
                      size="large"
                      as="a"
                      href="/"
                      className={`button-header white-button`}
                    >
                      View Progress
                    </Button>
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item>
                    <Button
                      secondary
                      fluid
                      as="a"
                      href="/register"
                      className={`button-header white-button`}
                    >
                      Register
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    {/*<Button
                      secondary
                      fluid
                      as="a"
                      href="https://fundraise.unfoundation.org/fundraiser/3140126"
                      target="_blank"
                      className={`button-header white-button`}
                    >
                      Donate
                    </Button>*/}
                  </Menu.Item>
                </>
              )}
            </Container>
          </Menu>
        </div>
      </>
    );
  }
}

export default Header;
