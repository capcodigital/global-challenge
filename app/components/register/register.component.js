import React from "react";
import queryString from "query-string";
import { Button, Form, Segment, Image } from "semantic-ui-react";
import { FormattedMessage } from "react-intl";
import "./style.scss";

const parameters = queryString.parse(window.location.search);
const SERVER_URL = process.env.SERVER_URL
  ? `https://${process.env.SERVER_URL}/`
  : "http://localhost/";

const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID
? `${process.env.FITBIT_CLIENT_ID}`
: "23BBBM";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID
? `${process.env.STRAVA_CLIENT_ID}`
: "7291";

const CHALLENGE_NAME = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : 'global';

const RegistrationForm = () => (
  <div className={`login-form ${CHALLENGE_NAME}`}>
    <Form size="large" action="https://www.strava.com/oauth/authorize?">
      <input type="hidden" name="response_type" value="code" />
      <input type="hidden" name="client_id" value={`${STRAVA_CLIENT_ID}`} />
      <input
        type="hidden"
        name="redirect_uri"
        value={`${SERVER_URL}strava/auth`}
      />
      <input type="hidden" name="scope" value="activity:read_all" />

      {parameters.success == "stravaSuccess" ? (
        <FormattedMessage id="homepage.success" />
      ) : parameters.success == "stravaRegistered" ? (
        <FormattedMessage id="homepage.stravaRegistered" />
      ) : parameters.success == "capcoRegistered" ? (
        <FormattedMessage id="homepage.capcoRegistered" />
      ) : parameters.success == "stravaError" ? (
        <FormattedMessage id="homepage.stravaError" />
      ) : parameters.success == "serverError" ? (
        <FormattedMessage id="homepage.serverError" />
      ) : (
        <div></div>
      )}

      <Form.Input
        fluid
        maxLength="4"
        placeholder="Capco ID"
        name="state"
        id="capco"
        pattern="[A-Za-z0-9]{4}"
        title="Please enter your 4 letter Capco ID"
        required
      />
      <Button className="strava" fluid size="large">
        <FormattedMessage id="register.strava" />
      </Button>
    </Form>

    <Form size="large" action="https://www.fitbit.com/oauth2/authorize?">
      <input type="hidden" name="response_type" value="code" />
      <input type="hidden" name="client_id" value={`${FITBIT_CLIENT_ID}`} />
      <input
        type="hidden"
        name="redirect_uri"
        value={`${SERVER_URL}fitbit/auth`}
      />
      <input type="hidden" name="scope" value="activity location" />

      {parameters.success == "fitBitSuccess" ? (
        <FormattedMessage id="homepage.success" />
      ) : parameters.success == "fitbitRegistered" ? (
        <FormattedMessage id="homepage.fitbitRegistered" />
      ) : parameters.success == "capcoRegistered" ? (
        <FormattedMessage id="homepage.capcoRegistered" />
      ) : parameters.success == "fitBitError" ? (
        <FormattedMessage id="homepage.fitBitError" />
      ) : parameters.success == "serverError" ? (
        <FormattedMessage id="homepage.serverError" />
      ) : (
        <div></div>
      )}

      <Form.Input
        fluid
        maxLength="4"
        placeholder="Capco ID"
        name="state"
        id="capco"
        pattern="[A-Za-z0-9]{4}"
        title="Please enter your 4 letter Capco ID"
        required
      />
      <Button className="fitbit" fluid size="large">
        <FormattedMessage id="register.fitbit" />
      </Button>
    </Form>
  </div>
);

export default RegistrationForm;
