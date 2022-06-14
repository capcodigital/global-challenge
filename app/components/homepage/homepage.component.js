/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Grid, Segment, Container, List, Button } from "semantic-ui-react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";
import RegistrationForm from "../register";
import landing from "./images/landing.svg";
import landingGlobal from "./images/landing-global.png";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

const HomePage = () => (
  <div className={`homepage ${challenge_name}`}>
    <Container>
      <Segment vertical>
        <Grid stackable>
          <Grid.Column width={10}>
            {challenge_name == "global" && (
              <img src={landingGlobal} width="650px" alt="Global Challenge" />
            )}
            {challenge_name == "uk" && (
              <img src={landing} alt="ESTR UK Challenge" />
            )}
          </Grid.Column>
          <Grid.Column width={6} className="registration">
            <FormattedHTMLMessage id="homepage.instructionsESTR" />
            <Button
              secondary
              fluid
              size="large"
              as="a"
              href="https://fundraise.unfoundation.org/fundraiser/3140126"
              target="_blank"
              className="donate"
            >
              <FormattedMessage id="homepage.donate" />
            </Button>

            <h2>Register</h2>
            <p>
              If you have a Strava or Fitbit account, please enter your Capco
              4-letter ID below to register. If you don't have a Strava or
              Fitbit account, please create an account via your desktop or by
              downloading and installing an app to allow you to register. For
              more information on setting up an account and syncing your data,
              please visit the <a href="/how-to">"Setup"</a> page.
            </p>

            <div className="registration-form-container">
              <RegistrationForm />
            </div>
            <h2>How to join a Team?</h2>
            <p>
              Once you have registered, if you would like to create or sign up
              for a team, you can do so using the <a href="/teams/register" >‘Teams’</a> button in the top
              right-hand corner (or using the left side menu on mobile). Each team will need to have six team member.
               Team members will be able to view their progress on a
              map alongside other teams and all kilometers will be added to our
              challenge total.
            </p>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  </div>
);

export default HomePage;
