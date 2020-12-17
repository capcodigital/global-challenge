import React from 'react';
import queryString from 'query-string';
import {
  Button, Form, Segment, Image
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Fitbit from './images/fitbitLogo.svg';
import Strava from './images/ConnectWithStrava.png';
import './style.scss';

const paramters = queryString.parse(window.location.search);

const RegistrationForm = () => (
  <div className="login-form">
    <Form size="large" action="https://www.fitbit.com/oauth2/authorize?">
      <Segment stacked>
        <input type="hidden" name="response_type" value="code" />
        <input type="hidden" name="client_id" value="228MZ3" />
        {/*}<input type="hidden" name="redirect_uri" value="https://capcoglobalchallenge.com/fitbit/auth" />*/}
        <input type="hidden" name="redirect_uri" value="https://localhost/fitbit/auth" />
        <input type="hidden" name="scope" value="activity location" />

        {
          (paramters.success == 'fitBitSuccess') ? <FormattedMessage id="homepage.success" />
          : (paramters.success == 'fitbitRegistered') ? <FormattedMessage id="homepage.fitbitRegistered" />
          : (paramters.success == 'capcoRegistered') ? <FormattedMessage id="homepage.capcoRegistered" />
          : (paramters.success == 'fitBitError') ? <FormattedMessage id="homepage.fitBitError" />
          : (paramters.success == 'serverError') ? <FormattedMessage id="homepage.serverError" />
          : <div></div>
        }

        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          maxLength="4"
          placeholder="Capco ID"
          name="state"
          id="capco"
          pattern="[A-Za-z]{4}"
          title="Please enter your 4 letter Capco ID"
          required
        />
        <Button className="fitbit" fluid size="large">
          <Image avatar src={Fitbit} verticalAlign="middle" />
          <FormattedMessage id="register.fitbit" />
        </Button>
      </Segment>
    </Form>
  
    <Form size="large" action="https://www.strava.com/oauth/authorize?">
      <Segment stacked>
        <input type="hidden" name="response_type" value="code" />
        <input type="hidden" name="client_id" value="7291" />
        {/*<input type="hidden" name="redirect_uri" value="https://capcoglobalchallenge.com/auth" />*/}
        <input type="hidden" name="redirect_uri" value="https://localhost/strava/auth" />
        <input type="hidden" name="scope" value="activity:read_all" />

        {
          (paramters.success == 'stravaSuccess') ? <FormattedMessage id="homepage.success" />
          : (paramters.success == 'stravaRegistered') ? <FormattedMessage id="homepage.stravaRegistered" />
          : (paramters.success == 'capcoRegistered') ? <FormattedMessage id="homepage.capcoRegistered" />
          : (paramters.success == 'stravaError') ? <FormattedMessage id="homepage.stravaError" />
          : (paramters.success == 'serverError') ? <FormattedMessage id="homepage.serverError" />
          : <div></div>
        }

        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          maxLength="4"
          placeholder="Capco ID"
          name="state"
          id="capco"
          pattern="[A-Za-z]{4}"
          title="Please enter your 4 letter Capco ID"
          required
        />
        <Button className="strava" fluid size="large">
          <Image avatar src={Strava} verticalAlign="middle" />
          <FormattedMessage id="register.strava" />
        </Button>
      </Segment>
    </Form>
  </div>
);

export default RegistrationForm;
