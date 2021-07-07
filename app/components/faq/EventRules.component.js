import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import "./style.scss";

const EventRules = () => (
  <>
    <Grid id="event-rules" className="question-section" stackable centered>
      <Grid.Column width={12} className="bold-box question-section-inner">
        <Header as="h1" textAlign="center">
          Event Rules
        </Header>
        <List bulleted>
          <List.Item>
            Only input data into Strava / Fitbit that you have completed if
            entering data manually.
          </List.Item>
          <List.Item>
            Do not alter distance completed by bike – the application will
            adjust this for you.
          </List.Item>
          <List.Item>
            Try and go further together – but do not push yourself beyond your
            own physical capabilities – it’s just for fun!
          </List.Item>
          <List.Item>
            All teams <i>should</i> be a total of 5.
          </List.Item>
          <List.Item>
            A minimum 3 members are required to form a team – but you will be
            disadvantaged against those teams with 5 – so seek more teammates!
          </List.Item>
          <List.Item>Have Fun!</List.Item>
        </List>
      </Grid.Column>
    </Grid>
  </>
);

export default EventRules;
