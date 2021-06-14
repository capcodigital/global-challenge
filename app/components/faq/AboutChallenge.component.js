import React from 'react';
import { Grid, List, Header, Icon } from 'semantic-ui-react';
import './style.scss';

const AboutChallenge = () => (
  <React.Fragment>
    <Grid id="about-challenge" stackable centered className='question-section' style={{ paddingTop: '2rem' }}>
      <Grid.Column width={12} className='bold-box' style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <Header as='h1' textAlign='center'>What's the challenge about?</Header>
        <List>
          <List.Item>We challenge you to walk, run, cycle, row or swim throughout August - all at your own pace, whenever and wherever – with a view to completing 700kms as a team of 5 by the end of the challenge – the distance from London to Edinburgh Capco Offices. </List.Item>
          <List.Item>This is about staying active and being involved in the Capco community. Further, we will be <a href='https://uk.virginmoneygiving.com/CapcoUKCSR1' taget='_blank'>fundraising for the NHS </a>, to thank all of those heroes who have gone above and beyond during the crisis this year.</List.Item>
          <List.Item>If you hate running, join us on your bike! Your counted distance will be 1/3 of that covered on foot, to try and keep things fair.</List.Item>
          <List.Item>If that’s not your thing you can even row or swim! No conversion factors will be applied here though; so you’ll need to get a splash on!</List.Item>
          <List.Item><b>Event Details</b></List.Item>
          <List.Item><b>Register By:</b> 29th July</List.Item>
          <List.Item><b>Challenge Date Range:</b> 1st to 30th August</List.Item>
        </List>
      </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default AboutChallenge;