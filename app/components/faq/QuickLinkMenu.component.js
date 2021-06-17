

import React from 'react';
import { Grid, Menu, Icon } from 'semantic-ui-react';
import './style.scss';

const QuickLinkMenu = () => (
  <React.Fragment>
    <Grid stackable centered style={{ paddingTop: '2rem' }}>
    <Grid.Column width={4} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
    <Menu vertical>
      <Menu.Item>
        <Menu.Header>How to Guides<Icon name='book' /></Menu.Header>
        <Menu.Menu>
          <Menu.Item href='#about-challenge'>
            About
          </Menu.Item>
          <Menu.Item href="#set-up-instructions">
            Setup Instructions
          </Menu.Item>
          <Menu.Item href="#strava-no-device">
            Strava Guide
          </Menu.Item>
          <Menu.Item href="https://help.fitbit.com/articles/en_US/Help_article/1875.htm#:~:text=MobileTrack%20lets%20you%20use%20the,%2C%20sleep%2C%20or%20active%20minutes" target="_blank">
            Fitbit Mobile Track - How to Guide
          </Menu.Item>
          <Menu.Item href="https://www.theverge.com/2019/8/27/20830247/fitbit-app-apple-watch-strava-connect-how-to" target="_blank">
            Link Apple Watch to Fitbit (Via Strava)
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
    </Grid.Column>
    <Grid.Column width={4} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
    <Menu vertical>
    <Menu.Item>
        <Menu.Header>How to Videos <Icon name='video' /></Menu.Header>
        <Menu.Menu>
          <Menu.Item href='https://www.youtube.com/watch?v=bkV4UvHMoIc' target='_blank'>
            Fitbit Account setup video – iPhone 
          </Menu.Item>
          <Menu.Item href="https://youtu.be/ttPvQmMqXts" target="_blank">
            Fitbit Account Setup Video – Android
          </Menu.Item>
          <Menu.Item href="https://www.youtube.com/watch?v=qUgJoFhqy_I" target="_blank">
            Fitbit Manually add activity Video
          </Menu.Item>
          <Menu.Item href="https://youtu.be/LHtCxdrZFJ8?t=482" target="_blank">
            Strava Account Setup Video
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
    </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default QuickLinkMenu;