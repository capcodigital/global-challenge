import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import StravaA from "./images/StravaA.png";
import StravaB from "./images/StravaB.png";

import "./style.scss";

const StravaSetupInstructions = () => (
  <>
    <Header id="strava-no-device" className="how-to-title strava-hue">
      Strava Full Setup Guide
    </Header>
    <Grid className="strava-text question-section step-text" stackable centered>
      <Grid.Column textAlign="left" verticalAlign="middle" width={12}>
        <List>
          <List.Item>
            Either download Strava on your mobile phone or sign up on your
            computer.
          </List.Item>
          <List.Item>
            Strava is <b>free</b> to use, however there is a premium paid
            version (Strava Summit) which encourages you to sign up (you do not
            need this!). Just SKIP this whenever it appears, the free version is
            all that is required for the challenge.
          </List.Item>
          <List.Item>
            <a
              href="https://www.youtube.com/watch?v=LHtCxdrZFJ8"
              target="_blank"
            >
              Setup Video
            </a>
          </List.Item>
          <List.Item>
            Strava Mobile App:{" "}
            <a href="www.strava.com/mobile" target="_blank">
              www.strava.com/mobile
            </a>
          </List.Item>
          <List.Item>
            Sign Up to Strava:{" "}
            <a href="www.strava.com/register/free" target="_blank">
              www.strava.com/register/free
            </a>
          </List.Item>
          <List.Item>
            1. You can sign up with Facebook or Google using your normal login
            for these services or you can enter you email address and sign up
            manually.
          </List.Item>
          <List.Item>2. Complete the form and select ‘Sign Up’.</List.Item>
          <List.Item>
            3. You will receive an email asking you to confirm your account – if
            you are unable to locate, try your spam folder.
          </List.Item>
          <List.Item>
            4. Select confirm email address on the email and log in to Strava
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={StravaA}></img>
      </Grid.Column>
    </Grid>
    <Grid className="strava-text" stackable centered>
      <Grid.Column textAlign="left" verticalAlign="middle" width={12}>
        <List>
          <List.Item>
            5. You will now be on the Strava dashboard page – select your gender
            and your sport – for this select running (don’t worry this is simply
            a setting and you do not have to run always - this is a multi sport
            event). There is a range of other data that Strava will request from
            you at this point however you can select ‘skip’ if you do not want
            to enter this.
          </List.Item>
          <List.Item>
            6. To 
            <b>
              ensure your activity is syncing and that your distance is measured
              in Kilometres
            </b>
             select your avatar (image), then select settings from the drop down
            menu, select display preferences and update Units & Measurements and
            Default Sport. For additional profile changes and assistance please
            refer to{" "}
            <a
              href="https://support.strava.com/hc/en-us/articles/216917697-Your-Strava-Profile-Page"
              target="_blank"
            >
              Strava's help page
            </a>
            .
          </List.Item>
          <List.Item>
            7. To <b>record your activities</b> you can either:
            <List bulleted>
              <List.Item>
                Use the Dashboard to log activity (from your web browser on your
                PC)
              </List.Item>
              <List.Item>
                <a href="www.strava.com/mobile" target="_blank">
                  Download the Strava app to your phone
                </a>
              </List.Item>
              <List.Item>
                Link your current device to Strava -{" "}
                <a
                  href="https://support.strava.com/hc/en-us/articles/223297187-How-to-get-your-Activities-to-Strava"
                  target="_blank"
                >
                  How to link your specific device to Strava
                </a>
              </List.Item>
              <List.Item>
                <a
                  href="https://support.strava.com/hc/en-us/articles/223297187-How-to-get-your-Activities-to-Strava"
                  target="_blank"
                >
                  Manually enter activity in Strava
                </a>
              </List.Item>
            </List>
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width={4}>
        <img src={StravaB}></img>
      </Grid.Column>
    </Grid>
  </>
);

export default StravaSetupInstructions;
