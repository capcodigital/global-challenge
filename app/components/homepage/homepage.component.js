/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  Grid,
  Segment,
  Container,
  List,
  Button,
} from "semantic-ui-react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";
import RegistrationForm from "../register";
import landing from "./images/landing.svg";
import "./style.scss";

const HomePage = () => (
  <div className="homepage">
    <Container>
      <Segment vertical>
        <Grid stackable>
          <Grid.Column width={10}>
            <img src={landing} />
          </Grid.Column>
          <Grid.Column width={6} className="registration">
            <FormattedHTMLMessage id="homepage.instructionsESTR" />
            <Button
              secondary
              fluid
              size="large"
              as="a"
              href="https://uk.virginmoneygiving.com/CapcoUKCSR1"
              target="_blank"
              className="donate"
            >
              <FormattedMessage id="homepage.donate" />
            </Button>

            <h2>Register</h2>

            <div className="registration-form-container">
              <RegistrationForm />
            </div>
            <h2>How to participate?</h2>
            <List ordered>
              <List.Item>
                Make a donation to our partner charity, using the ‘Donate’
                button on this page
              </List.Item>
              <List.Item>
                If you don't already have a Strava account please either
                register via desktop or download and install this on your{" "}
                <a
                  href="https://itunes.apple.com/us/app/fitbit-activity-calorie-tracker/id462638897?"
                  target="_blank"
                >
                  iOS
                </a>{" "}
                or{" "}
                <a
                  href="https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile"
                  target="_blank"
                >
                  Android
                </a>{" "}
                device
              </List.Item>
              <List.Item>
                Follow the prompts in Strava to create your personal account.
              </List.Item>
              <List.Item>
                In the 'Register' section on this page, enter your Capco
                4-letter ID.
              </List.Item>
              <List.Item>
                Click 'Register with Strava' and you'll be taken to a page which
                will ask you to give permission for Capco to access your
                activity and location data. Please click 'allow'.
              </List.Item>
              <List.Item>
                Either enter data manually through the Strava application or
                wear and sync your device with Strava.
              </List.Item>
              <List.Item>
                Fitbit users. You can link your Fitbit to a Strava Account and
                then register for the challenge as above (preferred) please see
                the see our <a href="/how-to">How To</a> for further
                information. This will ensure you auto tracked fitbit activity
                is synced with the application.
              </List.Item>
              <List.Item>
                You can alternatively register directly with the Capco
                application, but please note that this method is still in
                development and may cause some synchronisation issues.
              </List.Item>
              <List.Item>
                You can also setup your iPhone to track your activity using
                Fitbit if you do not have a wearable device – please see our see
                our <a href="/how-to">How To</a> for more details.
              </List.Item>
              <List.Item>
                Please donate by clicking on the button below before registering
                for the Challenge. We ask that you donate £5 or more, or
                whatever you can spare. Through our Corporate Matching Program,
                Capco will also contribute to the money raised.
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  </div>
);

export default HomePage;
