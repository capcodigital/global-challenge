import React from "react";
import { Grid, Header, Segment, Container } from "semantic-ui-react";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

const AboutPage = () => (
  <div className={challenge_name}>
  <Container>
    <Segment vertical>
      {challenge_name === "global" && (
        <>
          <Grid
            columns="equal"
            stackable
            centered
            className="about-container-global"
          >
            <Grid.Column
              style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
              width={16}
            >
              <Header className="global-title">About</Header>
            </Grid.Column>
          </Grid>
          <Grid
            columns="equal"
            stackable
            centered
            className="about-container-global"
          >
            <Grid.Column
              style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
              width={8}
              className="about-section"
            >
              <p>The Capco Global Challenge is making a return this year!</p>
              <p>
                Organized by the Wellbeing@Capco team in partnership with Capco
                CSR, this annual event brings Capco colleagues together to
                collaborate and compete while raising important funds for
                charity.
                <br />
                <br /> Run, walk, bike, swim or row while raising funds for our
                chosen charity, the{" "}
                <a
                  href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate"
                  target="_blank"
                >
                  World Health Organization COVID-19 Solidarity Response Fund
                </a>
                .
              </p>
              <p>
                All distances will be tracked via the Capco Global Challenge app
                and will help us to achieve our collective target of 50,000 Km
                - the distance* between all our Capco offices.
              </p>
              <p>
                <b><a href='/register'>Sign up for the Challenge today!</a></b>
              </p>
              <i> *Distance is approximate and can vary by route</i>
            </Grid.Column>

            <Grid.Column
              style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
              className="about-section boxed"
              width={8}
            >
              <p>
                <b>Event Details</b> <br />
                <br />
                <b>Registration Deadline: </b>
                <p className="red">November, 7th 2021</p>
                <br />
                <b>Challenge Dates: </b>
                <p className="red">November 8, 2021 - November 21, 2021</p>
                <br />
                <br />
                <p>
                  <b>Registration: </b>
                  Donate $5 (or equivalent currency) or whatever you can spare to
                  WHO COVID-19 Response Fund and register as an individual participant
                  or team (see below) using the buttons in the top right-hand corner.
                </p>
                <b>Team Challenge: </b>
                Participants are invited to form a team of four to complete a
                virtual Mount Fiji Ultra Marathon – a distance of 166 Km! All
                kilometers will be added to our global total, with the bonus of
                being able to compete against other teams.
                <br />
                <br />
                <b>COVID-19 Restrictions: </b>
                If you are unable to take part in outdoor exercise due to local
                Covid-19 restrictions, you can still participate. Please see the
                FAQs page{" "}
                <a href="/faq">
                  here
                </a>{" "}
                for more information.
                <br />
                <br />
              </p>
            </Grid.Column>
          </Grid>
        </>
      )}
      {challenge_name === "uk" && (
        <Grid 
        columns="equal"
        stackable
        centered
        className="about-container">
          <Grid.Column className="about-section column-b">
            <Header className="about-title">About</Header>
            <p>
            Summer 2022 sees the return of <b>Easier Said That Run (ESTR) </b>!  
            Some of you may have taken part previously, but for any new joins since the last event, 
            ESTR is a multi-sport team event where you’ll work together in teams to cover a set distance.
            </p>
            <p>
            The summer event will take place over a 2-week period between June 27th – July 9th 2022, 
            and you’ll be racing from Capco London office to Capco Edinburgh office*.
            </p>
           {/*
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
      */}
            <p>
            All distances will be tracked via the {" "}
                <a href="/">
                Capco Easier Said Than Run UK Challenge website/app
                </a>{" "}
            and will help us to achieve our collective target of ~400 miles*.
            </p>
            <p>
          <b>Registration:</b> <br />
Register as an individual participant or team (see below) using the buttons in the top right-hand corner.
            </p>
            <p>
            <b>Team Challenge:</b> <br />
            Participants are invited to form a team of four to race the distance between Capco’s Great Eastern Street and
            Rose Street offices – if you don’t have a team, you can be allocated to one that isn’t full. 
            All miles will be added to our global total, with the bonus of being able to compete against other teams.
            </p>
            <p>
            <b>COVID-19 Restrictions:</b> <br />
            If you are unable to take part in outdoor exercise due to local Covid-19 restrictions, you can still participate. 
            Please see the FAQs page.
            </p>
            <p>
            We challenge you to walk, run and/or cycle over these 2 weeks – all at your own pace, whenever and wherever – with a view to completing the ~400 mile (~700km) distance as a team by the end of the challenge – 
            the distance from our London to Edinburgh Capco Offices. This is about staying active and being involved in the Capco community. Further, we will be fundraising for the NHS. 
            </p>
            <p>
If you hate running, join us on your bike! Your counted distance will be 1/3 of that covered on foot, to try and keep things fair.
            </p>
            <p>
              <b>Event Details</b> <br />
              Register By: 
              <p className="red">26th June</p>
              <br />
              Challenge Date Range: <p className="red">27th June - 9th July</p>
            </p>
            <p>
                <b><a href='/register'>Sign up for the Challenge today!</a></b>
              </p>
            <i> *Distance is approximate and can vary by route</i>
          </Grid.Column>
        </Grid>
      )}
    </Segment>
   
  </Container>
  </div>
);

export default AboutPage;
