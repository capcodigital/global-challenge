import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import { setupA, setupB, setupC, setupD, setupE } from "./images";
import "./style.scss";

const SetupInstructions = () => (
  <>
    <Header id="set-up-instructions" className="how-to-title">
      Setup Instructions
    </Header>
    <Grid className="step-text" stackable centered>
      <Grid.Column textAlign="left" verticalAlign="middle" width={12}>
        <List>
          <List.Item>
            1. Connect your Strava or Fitbit account to the Global Challenge app
            by opening the Global Challenge app.
          </List.Item>
          <List.Item>
            2. Enter your Capco 4-letter ID on the{" "}
            <a href="/register">Registration</a> page for either Strava or
            Fitbit.
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4} className="text-image">
        <img src={setupA} alt="Registration page screenshot" />
      </Grid.Column>
    </Grid>
    <Header id="strava-specifc-steps" className="how-to-title strava-hue">
      Strava Authorization
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
            1. Link the Capco Global Challenge app with your Strava account, by
            entering your Strava credentials.
          </List.Item>
          <List.Item>
            2. If you haven’t set up a Strava account yet select “Sign Up” and
            follow{" "}
            <a href="https://youtu.be/LHtCxdrZFJ8?t=482" target="_blank">
              {" "}
              these steps
            </a>
            .
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4} className="text-image">
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
            3. Click on ‘Authorize’ to share your Strava activity information
            with the Capco Global Challenge app.
          </List.Item>
          <List.Item>
            4. The Strava app will ask you if you wish to share private activity
            – this is up to you – only activity shared will be counted.
          </List.Item>
          <List.Item>
            5. Your Capco Global Challenge registration is now complete!
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4} className="text-image">
        <img src={setupE} alt="Authorize Strava sharing data with Capco" />
      </Grid.Column>
    </Grid>
    <Header id="fitbit-specifc-steps" className="how-to-title fitbit-hue">
      Fitbit Authorization
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
            follow these steps:{" "}
            <a
              href="https://www.youtube.com/watch?v=bkV4UvHMoIc"
              target="_blank"
            >
              {" "}
              iOS
            </a>{" "}
            /
            <a href="https://youtu.be/ttPvQmMqXts" target="_blank">
              {" "}
              Android
            </a>
            .
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4} className="text-image">
        <img src={setupC} alt="Fitbit login page" />
      </Grid.Column>
    </Grid>
    <Grid className="step-text" stackable centered>
      <Grid.Column textAlign="left" verticalAlign="middle" width={12}>
        <List>
          <List.Item>
            3. Click on “Accept” to share your Fitbit activity information with
            the Capco Global Challenge app{" "}
          </List.Item>
          <List.Item>
            4. Your Capco Global Challenge registration is now complete!
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4} className="text-image">
        <img src={setupB} alt="Authorize Fitbit sharing data with Capco" />
      </Grid.Column>
    </Grid>
  </>
);

export default SetupInstructions;
