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
              <img rc={landing} alt="ESTR UK Challenge" />
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

            <div className="registration-form-container">
              <RegistrationForm />
            </div>
            <h2>How to participate?</h2>
            <p>To register for the Capco Global Challenge:</p>
            <List ordered>
              <List.Item>
                1. Make a donation to our chosen charity for this year’s
                Challenge, the World Health Organization COVID-19 Solidarity
                Response Fund using the button above. All money raised will be
                matched by Capco through our Corporate Matching Program (up to a
                value of $2000).
              </List.Item>
              <List.Item>
                2. If you have a Strava or Fitbit account, please enter your
                Capco 4-letter ID below to register. If you don't have a Strava
                or Fitbit account, please create an account via your desktop or
                by downloading and installing an app to allow you to register.
                For more information on setting up an account and syncing your
                data, please visit the <a href="/how-to">"Setup"</a> page.
              </List.Item>
              <List.Item>
                3. Once you have registered, if you would like to create or sign
                up for a team, you can do so using the ‘Teams’ button in the top
                right-hand corner. Each team will need to have four team members
                and will complete a virtual Mount Fiji Ultra Marathon – a
                distance of 166 KM! Team members will be able to view their
                progress on a map alongside other teams and all kilometers will
                be added to our global total.
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  </div>
);

export default HomePage;
