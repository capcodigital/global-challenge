import React from 'react';
import { Grid, List, Header, Menu, Icon } from 'semantic-ui-react';
import './style.scss';
import { rightArrowIcon } from "./images";

const QuestionList = (props) => (
  <React.Fragment>
    <Grid stackable centered > 
      <Grid.Column width={8} style={{ paddingBottom: '3rem' }}>
        <List>
          <React.Fragment>
            <Header><a href={"#event-rules"}>Event Rules</a></Header>
            <Header><a href={"#about-challenge"}>What's the challenge about?</a></Header>
            <Header><a href={"#set-up-instructions"}>Set Up instructions</a></Header>
            <Header><a href={"#fitbit-specifc-steps"}>Fitbit Specific Steps</a></Header>
            <Header ><a className="strava-hue" href={"#strava-specifc-steps"}>Strava Specific</a></Header>
            <Header ><a className="strava-hue" href={"#strava-no-device"}>Strava Setup Guide (No Device/Manual entry)</a></Header>
            <Header>General</Header>
              {props.questionData.general.map((question) => (
                <List.Item key={question.questionText}><img src={rightArrowIcon} alt="Next arrow" /> <a href={"#" + question.questionId}>{question.questionText}</a></List.Item>
              ))}
            <Header>Team</Header>
              {props.questionData.team.map((question) => (
                <List.Item key={question.questionText}><img src={rightArrowIcon} alt="Next arrow" /> <a href={"#" + question.questionId}>{question.questionText}</a></List.Item>
              ))}
            <Header>Data</Header>
              {props.questionData.data.map((question) => (
                <List.Item key={question.questionText}><img src={rightArrowIcon} alt="Next arrow" /> <a href={"#" + question.questionId}>{question.questionText}</a></List.Item>
              ))}
          </React.Fragment>
        </List>
      </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default QuestionList;