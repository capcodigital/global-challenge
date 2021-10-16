/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Header, Grid } from "semantic-ui-react";
import "./style.scss";
import SetupInstructions from "./SetupInstructions.component";
import StravaSetupInstructions from "./StravaSetupInstructions.component";

function SetupInstructions() {
  return (
    <>
      <Grid className="faq-container" stackable centered>
        <Grid.Column className="column-a"></Grid.Column>
        <Grid.Column className="faq-section column-b">
          <Header>
            <a href={"#set-up-instructions"}>Setup Instructions</a>
          </Header>
          <Header className="sub-header">
            <a href={"#fitbit-specifc-steps"}>Fitbit Authorisation</a>
          </Header>
          <Header className="sub-header sub-header-lower">
            <a className="strava-hue" href={"#strava-specifc-steps"}>
              Strava Authorisation
            </a>
          </Header>
          <Header className="header-following">
            <a className="strava-hue" href={"#strava-no-device"}>
              Strava Full Setup Guide
            </a>
          </Header>
          <SetupInstructions />
          <StravaSetupInstructions />
        </Grid.Column>
      </Grid>
    </>
  );
}

export default SetupInstructions;
