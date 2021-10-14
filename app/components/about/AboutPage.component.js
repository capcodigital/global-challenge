import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

const AboutPage = () => (
  <Segment className="secondary">
    <Grid className={`about-container ${challenge_name}`}>
      <Grid.Column className="about-section column-b">
        {challenge_name === "global" && (
          <>
            <p>The Capco Global Challenge is making a return this year!</p>
            <p>
              Organized by the Wellbeing@Capco team in partnership with Capco
              CSR, this annual event brings Capco colleagues together to
              collaborate and compete while raising important funds for charity.
              <br />
              <br /> Run, walk, bike, swim or row while raising funds for our
              chosen charity, the{" "}
              <a
                href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate"
                taget="_blank"
              >
                World Health Organization COVID-19 Solidarity Response Fund
              </a>
              .
            </p>
            <p>
              All distances will be tracked via the Capco Global Challenge app
              and will help us to achieve our collective target of 50,000 Kms -
              the distance* between all our Capco offices.
            </p>
            <p>
              <b>Sign up for the Challenge today!</b>
            </p>
            <p>
              <b>Event Details</b> <br />
              <b>Registration Deadline: </b>
              <p className="red">October, 31st 2021</p>
              <br />
              <b>Challenge Starts: </b>
              <p className="red">November, 1 2021</p> (and ends when we reach
              50,000 Kms!)
              <br />
              <b>Registration: </b>
              Donate to WHO COVID-19 Response and register as an individual
              participant or team (see below) using the buttons in the top
              right-hand corner.
              <br />
              <b>Team Challenge: </b>
              Participants are invited to form a team of four to complete a
              virtual Mount Fiji Ultra Marathon – a distance of 166 Kms! All
              kilometers will be added to our global total, with the bonus of
              being able to compete against other teams.
              <br />
              <b>COVID-19 Restrictions</b>
              If you are unable to take part in outdoor exercise due to local
              Covid-19 restrictions, you can still participate. Please see the
              FAQs page{" "}
              <a href="" target="_blank">
                here
              </a>{" "}
              for more information.
            </p>
          </>
        )}
        {challenge_name === "uk" && (
          <>
            <Header className="about-title">About</Header>
            <p>
              We challenge you to walk, run, cycle, row or swim throughout
              August - all at your own pace, whenever and wherever – with a view
              to completing 700kms as a team of 5 by the end of the challenge –
              the distance from London to Edinburgh Capco Offices.
            </p>
            <p>
              This is about staying active and being involved in the Capco
              community. Further, we will be{" "}
              <a
                href="https://fundraise.unfoundation.org/fundraiser/3140126"
                taget="_blank"
              >
                fundraising for the NHS
              </a>
              , to thank all of those heroes who have gone above and beyond
              during the crisis this year.
            </p>
            <p>
              If you hate running, join us on your bike! Your counted distance
              will be 1/3 of that covered on foot, to try and keep things fair.
            </p>
            <p>
              If that’s not your thing you can even row or swim! No conversion
              factors will be applied here though; so you’ll need to get a
              splash on!
            </p>
            <p>
              <b>Event Details</b> <br />
              Register By: 
              <p className="red">31st August</p>
              <br />
              Challenge Date Range: <p className="red">1st - 30th September</p>
            </p>
          </>
        )}
      </Grid.Column>
    </Grid>
  </Segment>
);

export default AboutPage;
