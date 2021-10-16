import React from "react";
import { Grid, Header, Segment, Container } from "semantic-ui-react";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

const EventRules = () => (
  <Container>
    <Segment vertical>
      {challenge_name === "global" && (
        <>
          <Grid className="event-rules-global" stackable
            centered>
            <Grid.Column
            style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
            width={16}
              className={`event-rules-section ${challenge_name}`}
            >
              <Header className="event-rules-title">Event Rules</Header>
              <p>Here are a few Global Challenge rules to get you started:</p>
              <p>
              <i class="angle double right icon"></i><b>Only input data into Strava / Fitbit</b> that you have
                completed if entering data manually.
              </p>
              <p>
              <i class="angle double right icon"></i><b>Do not amend distances completed by bike</b> – the Global
                Challenge app will do this for you.
              </p>
              <p>
              <i class="angle double right icon"></i><b>All teams should have a total of four team members.</b>
              </p>
              <p>
              <i class="angle double right icon"></i><b>Try and go further together</b> – but do not push yourself
                beyond your own physical capabilities – it’s just for fun!
              </p>
              <p>
              …And most of all, enjoy the Challenge!
              </p>
            </Grid.Column>
          </Grid>
        </>
      )}
      {challenge_name === "uk" && (
        <>
          <Grid className={`event-rules-container ${challenge_name}`}>
            <Grid.Column
              className={`event-rules-section column-b ${challenge_name}`}
            >
              <Header className="event-rules-title">Event Rules</Header>
              <p>
                <b>Only input data into Strava / Fitbit</b> that you have
                completed if entering data manually.
              </p>
              <p>
                <b>Do not alter distance completed by bike</b> – the application
                will adjust this for you.
              </p>
              <p>
                <b>Try and go further together</b> – but do not push yourself
                beyond your own physical capabilities – it’s just for fun!
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
        </>
      )}
    </Segment>
  </Container>
);

export default EventRules;
