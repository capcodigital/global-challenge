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
              Organized by the Wellbeing@Capco team in partnership with Capco CSR, 
              this annual event brings Capco colleagues together to collaborate and 
              compete while raising important funds for charity. 
              <br />
              <br />
              Run, walk, or cycle while raising funds for our chosen charity,
              <a
                href="https://www.justgiving.com/page/capco-global-csr-globalchallenge2024"
                target="_blank"
              >
                Médicins Sans Frontières
              </a>
                .
              </p>
              <p>
              All distances will be tracked via the Capco Global Challenge platform and will help us to achieve our collective target of 50,000 Kms - the distance* between all our Capco offices.
              </p>
              <p>
                <b><a href='/register'>Sign up for the Challenge today!</a></b>
              </p>
              <i> *Distance is approximate and can vary by route</i>
              <br />
              <br />
            </Grid.Column>

            <Grid.Column
              style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
              className="about-section boxed"
              width={8}
            >
              <p>
                <b>Event Details</b> <br />
                <br />
                <b>Registration Opens: </b>
                <p className="red">May, 22nd 2024</p>
                <br />
                <b>Challenge Starts: </b>
                <p className="red">June 5th, 2024</p>
                <br />
                <b>Challenge Ends: </b>
                <p className="red">July 26th, 2024</p>
                <br />
                <br />
                <p>
                  <b>Registration: </b>
                  Register using the button in the top right-hand corner.
                </p>
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
            Spring 2023 sees the return of  <b>Easier Said That Run (ESTR)  </b> ! 
            Some of you may have taken part previously, but for any new joins since the last event, 
            ESTR is a team event where you’ll work together in teams to cover a set distance.
            <p>
            The spring event will take place over 1 month between 01 – 31 March, 
            and you’ll be racing from Capco London office to Capco Manchester office*. 
            All distances will be tracked via the Capco Easier Said Than Run UK Challenge website/app
            </p>
            </p>
            <p>
            All distances will be tracked via the {" "}
                <a href="/">
                Capco Easier Said Than Run UK Challenge website/app
                </a>{" "}.
            </p>
            <p>
          <b>Registration:</b> <br />
          Register as an individual participant first and then create or join a team (see below) using the buttons in the top right-hand corner.
            </p>
            <p>
            <b>Team Challenge:</b> <br />
            Participants are invited to form a team of four to race the distance between Capco’s Great Eastern Street and Manchester offices – if you don’t have a team, you can be allocated to one that isn’t full.
            </p>
            <p>
            <b>COVID-19 Restrictions:</b> <br />
            <p>
            If you are unable to take part in outdoor exercise due to local Covid-19 restrictions, you can still participate. Please see the FAQs page.
            </p>
            <p>
        We challenge you to walk, run or jog over the coming month – all at your own pace, whenever and wherever – with a view to completing the ~280Km distance as a team by the end of the challenge – the distance from our London to Manchester Capco Offices. This is about staying active and being involved in the Capco community.
            </p>
            </p>
            <p>
              <b>Event Details</b> <br />
              Register By: 
              <p className="red">28th Feb</p>
              <br />
              Challenge Date Range: <p className="red">1st March - 31st March</p>
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
