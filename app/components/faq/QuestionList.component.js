import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import { rightArrowIcon } from "./images";
import PropTypes from "prop-types";
import "./style.scss";
import QuickLinkMenu from "./QuickLinkMenu.component";

const QuestionList = ({ questionData }) => (
  <>
    <Grid stackable>
      <Grid.Column className="question-section-inner" width={6}>
        <QuickLinkMenu></QuickLinkMenu>
      </Grid.Column>
      <Grid.Column className="question-section-inner" width={8}>
        <Header>
          <a href={"#about-challenge"}>What's the challenge about?</a>
        </Header>
        <Header>
          <a href={"#event-rules"}>Event Rules</a>
        </Header>
        <Header>
          <a href={"#set-up-instructions"}>Setup Instructions</a>
        </Header>
        <Header className="sub-header">
          <a href={"#fitbit-specifc-steps"}>Fitbit Authorisation</a>
        </Header>
        <Header className="sub-header sub-header-lower">
          <a className="strava-hue" href={"#strava-specifc-steps"}>
            Strava Authorisation
          </a>
        </Header>
        <Header className="header-following">
          <a className="strava-hue" href={"#strava-no-device"}>
            Strava Full Setup Guide
          </a>
        </Header>
        <Header>General</Header>
        {questionData.general.map((question) => (
          <List.Item key={question.questionText}>
            <img src={rightArrowIcon} alt="Next arrow" />{" "}
            <a href={`#${question.questionId}`}>{question.questionText}</a>
          </List.Item>
        ))}
        <Header>Team</Header>
        {questionData.team.map((question) => (
          <List.Item key={question.questionText}>
            <img src={rightArrowIcon} alt="Next arrow" />{" "}
            <a href={`#${question.questionId}`}>{question.questionText}</a>
          </List.Item>
        ))}
        <Header>Data</Header>
        {questionData.data.map((question) => (
          <List.Item key={question.questionText}>
            <img src={rightArrowIcon} alt="Next arrow" />{" "}
            <a href={`#${question.questionId}`}>{question.questionText}</a>
          </List.Item>
        ))}
      </Grid.Column>
    </Grid>
  </>
);

QuestionList.propTypes = {
  questionData: PropTypes.object.isRequired,
};

export default QuestionList;
