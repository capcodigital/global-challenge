import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import "./style.scss";

const AboutChallenge = () => (
  <>
    <Grid id="about-challenge" className="question-section" stackable centered>
      <Grid.Column width={12} className="bold-box question-section-inner">
        <Header as="h1" textAlign="center">
          What's the challenge about?
        </Header>
        <p>
          We challenge you to walk, run, cycle, row or swim throughout August -
          all at your own pace, whenever and wherever – with a view to
          completing 700kms as a team of 5 by the end of the challenge – the
          distance from London to Edinburgh Capco Offices.
        </p>
        <p>
          This is about staying active and being involved in the Capco
          community. Further, we will be{" "}
          <a href="https://uk.virginmoneygiving.com/CapcoUKCSR1" taget="_blank">
            fundraising for the NHS
          </a>
          , to thank all of those heroes who have gone above and beyond during
          the crisis this year.
        </p>
        <p>
          If you hate running, join us on your bike! Your counted distance will
          be 1/3 of that covered on foot, to try and keep things fair.
        </p>
        <p>
          If that’s not your thing you can even row or swim! No conversion
          factors will be applied here though; so you’ll need to get a splash
          on!
        </p>
        <p>
          <b>
            <u>Event Details</u>
          </b>
        </p>
        <p>
          <b>Register By:</b> 29th July
        </p>
        <p>
          <b>Challenge Date Range:</b> 1st to 30th August
        </p>
      </Grid.Column>
    </Grid>
  </>
);

export default AboutChallenge;
