import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import "./style.scss";

const EventRules = () => (
  <>
    <Segment className="secondary">
      <Grid className="event-rules-container" stackable centered>
        <Grid.Column className="column-a"></Grid.Column>
        <Grid.Column className="event-rules-section column-b">
          <Header className="event-rules-title">Event Rules</Header>
          <p>
            <b>Only input data into Strava / Fitbit</b> that you have completed
            if entering data manually.
          </p>
          <p>
            <b>Do not alter distance completed by bike</b> – the application
            will adjust this for you.
          </p>
          <p>
            <b>Try and go further together</b> – but do not push yourself beyond
            your own physical capabilities – it’s just for fun!
          </p>
          <p>
            <b>All teams should be a total of 5.</b>
          </p>
          <p>
            <b>A minimum 3 members are required to form a team</b> – but you
            will be disadvantaged against those teams with 5 – so seek more
            teammates!
          </p>
          <p>
            <b>Have Fun!</b>
          </p>
        </Grid.Column>
      </Grid>
    </Segment>
  </>
);

export default EventRules;
