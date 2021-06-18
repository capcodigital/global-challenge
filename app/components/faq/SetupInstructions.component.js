import React from 'react';
import { Grid, List, Header } from 'semantic-ui-react';
import SetupInstructionsA from "./images/SetupInstructionsA.png";
import SetupInstructionsB from "./images/SetupInstructionsB.png";
import SetupInstructionsC from "./images/SetupInstructionsC.png";
import SetupInstructionsD from "./images/SetupInstructionsD.png";
import SetupInstructionsE from "./images/SetupInstructionsE.png";
import './style.scss';

const SetupInstructions = () => (
  <React.Fragment>
    <Header id="set-up-instructions" className="strava-hue" as='h1' textAlign='center'>Set up Instructions</Header>
    <Grid className="step-text" stackable centered style={{ paddingTop: '2rem' }}>
      <Grid.Column textAlign="left" verticalAlign='middle' width={6} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <List.Item>1. Connect your Fitbit or Strava account to Capco Challenge platform. Open the challenge website.</List.Item>
          <List.Item>2. Enter your Capco 4-letter ID in the 'Register' section on this page for either Strava or Fitbit.</List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={6}>
        <img src={SetupInstructionsA}></img>
      </Grid.Column>
    </Grid>
    <Grid className="step-text" stackable centered style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
      <Grid.Column width={6}>
        <img src={SetupInstructionsB}></img>
      </Grid.Column>
      <Grid.Column textAlign="left" verticalAlign='middle' width={6} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <List.Item>3. Click on “Accept” to share your Fitbit activity information with the Capco Challenge platform. </List.Item>
          <List.Item>4. Your registration is now completed successfully!</List.Item>
        </List>
      </Grid.Column>
    </Grid>
    <Header id="fitbit-specifc-steps" as='h1' textAlign='center' className="fitbit-hue">Fitbit Specific Steps</Header>
    <Grid className="step-text" stackable centered style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
      <Grid.Column textAlign="left" verticalAlign='middle' width={6} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <List.Item>1. Link the Capco Global Step Challenge platform with your Fitbit account, by entering your Fitbit credentials.</List.Item>
          <List.Item>2. If you haven’t set up a Fitbit account yet select “Sign Up” and follow these steps.</List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={6}>
        <img src={SetupInstructionsC}></img>
      </Grid.Column>
    </Grid>
    <Header id="strava-specifc-steps" as='h1' textAlign='center' className="strava-hue">Strava Specific Steps</Header>
    <Grid className="step-text" stackable centered style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
      <Grid.Column textAlign="left" verticalAlign='middle' width={6} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <List.Item>1. Link the Capco Global Step Challenge platform with your Strava account, by entering your Strava credentials.</List.Item>
          <List.Item>2. If you haven’t set up a Strava account yet select “Sign Up” and follow these steps.</List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={6}>
        <img src={SetupInstructionsD}></img>
      </Grid.Column>
    </Grid>
    <Grid className="step-text" stackable centered style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
      <Grid.Column width={6}>
        <img src={SetupInstructionsE}></img>
      </Grid.Column>
      <Grid.Column textAlign="left" verticalAlign='middle' width={6} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <List.Item>3. Click on “Authorize” to share your Strava activity information with the Capco Challenge platform.</List.Item>
          <List.Item>4. You can choses to share private activities if you wish – this is up to you.</List.Item>
          <List.Item>5. Your registration is now completed successfully!</List.Item>
        </List>
      </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default SetupInstructions;