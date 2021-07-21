import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import { setupA, setupB, setupC, setupD, setupE } from "./images";
import "./style.scss";

const SetupInstructions = () => (
  <>
    <Header
      id="set-up-instructions"
      className="how-to-title"
    >
      Setup Instructions
    </Header>
    <Grid className="step-text" stackable centered>
      <Grid.Column
        textAlign="left"
        verticalAlign="middle"
        width={12}
      >
        <List>
          <List.Item>
            1. Connect your Fitbit or Strava account to Capco Challenge
            platform. Open the challenge website.
          </List.Item>
          <List.Item>
            2. Enter your Capco 4-letter ID in the '<a href='/register'>Registration</a>' section on this
            page for either Strava or Fitbit.
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={setupA} alt="Registration page screenshot" />
      </Grid.Column>
    </Grid>
    <Grid className="step-text" stackable centered>
      <Grid.Column
        textAlign="left"
        verticalAlign="middle"
        width={12}
      >
        <List>
          <List.Item>
            3. Click on “Accept” to share your Fitbit activity information with
            the Capco Challenge platform.{" "}
          </List.Item>
          <List.Item>
            4. Your registration is now completed successfully!
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={setupB} alt="Authorize Fitbit sharing data with Capco" />
      </Grid.Column>
    </Grid>
    <Header
      id="fitbit-specifc-steps"
      className="how-to-title fitbit-hue"
    >
      Fitbit Authorisation
    </Header>
    <Grid className="step-text" stackable centered>
      <Grid.Column
        className="question-section-inner"
        textAlign="left"
        verticalAlign="middle"
        width={12}
      >
        <List>
          <List.Item>
            1. Link the Capco Global Step Challenge platform with your Fitbit
            account, by entering your Fitbit credentials.
          </List.Item>
          <List.Item>
            2. If you haven’t set up a Fitbit account yet select “Sign Up” and
            follow <i>these</i> steps.
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={setupC} alt="Fitbit login page" />
      </Grid.Column>
    </Grid>
    <Header
      id="strava-specifc-steps"
      className="how-to-title strava-hue"
    >
      Strava Authorisation
    </Header>
    <Grid className="step-text grid-column-normal" stackable centered>
      <Grid.Column
        className="question-section-inner"
        textAlign="left"
        verticalAlign="middle"
        width={12}
      >
        <List>
          <List.Item>
            1. Link the Capco Global Step Challenge platform with your Strava
            account, by entering your Strava credentials.
          </List.Item>
          <List.Item>
            2. If you haven’t set up a Strava account yet select “Sign Up” and
            follow <i>these</i> steps.
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={setupD} alt="Strava login page" />
      </Grid.Column>
    </Grid>
    <Grid className="step-text" stackable centered>
      <Grid.Column
        className="question-section-inner"
        textAlign="left"
        verticalAlign="middle"
        width={12}
      >
        <List>
          <List.Item>
            3. Click on “Authorize” to share your Strava activity information
            with the Capco Challenge platform.
          </List.Item>
          <List.Item>
            4. You can choses to share private activities if you wish – this is
            up to you.
          </List.Item>
          <List.Item>
            5. Your registration is now completed successfully!
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={setupE} alt="Authorize Strava sharing data with Capco" />
      </Grid.Column>
    </Grid>
  </>
);

export default SetupInstructions;
