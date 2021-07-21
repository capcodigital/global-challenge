import React from "react";
import { Grid, Header, List } from "semantic-ui-react";
import SetupInstructions from "./SetupInstructions.component";
import StravaSetupInstructions from "./StravaSetupInstructions.component";
import "./style.scss";

const HowTo = () => (
  <>
    <Grid className="how-to-container" stackable centered>
      <Grid.Column className="column-a"></Grid.Column>
      <Grid.Column className="how-to-section column-b">
        <Header className="how-to-title">How to</Header>
        <Grid>
          <Grid.Column className="column-c">
            <Header className="how-to-title smaller">How to Videos</Header>
            <List bulleted>
              <List.Item
                href="https://www.youtube.com/watch?v=bkV4UvHMoIc"
                target="_blank"
              >
                Fitbit Account setup video – iPhone
              </List.Item>
              <List.Item href="https://youtu.be/ttPvQmMqXts" target="_blank">
                Fitbit Account Setup Video – Android
              </List.Item>
              <List.Item
                href="https://www.youtube.com/watch?v=qUgJoFhqy_I"
                target="_blank"
              >
                Fitbit Manually add activity Video
              </List.Item>
              <List.Item
                href="https://youtu.be/LHtCxdrZFJ8?t=482"
                target="_blank"
              >
                Strava Account Setup Video
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column className="column-c">
            <Header className="how-to-title smaller">How to Guides</Header>
            <List bulleted>
              <List.Item href="#set-up-instructions">
                Challenge Setup Instructions
              </List.Item>
              <List.Item href="#strava-no-device">Strava Guide</List.Item>
              <List.Item
                href="https://help.fitbit.com/articles/en_US/Help_article/1875.htm#:~:text=MobileTrack%20lets%20you%20use%20the,%2C%20sleep%2C%20or%20active%20minutes"
                target="_blank"
              >
                Fitbit Mobile Track - How to Guide
              </List.Item>
              <List.Item
                href="https://www.theverge.com/2019/8/27/20830247/fitbit-app-apple-watch-strava-connect-how-to"
                target="_blank"
              >
                Link Apple Watch to Fitbit (Via Strava)
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
        <Grid.Column className="how-to-section column-b">
          <SetupInstructions />
          <StravaSetupInstructions />
        </Grid.Column>
      </Grid.Column>
    </Grid>
  </>
);

export default HowTo;
