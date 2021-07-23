import React from "react";
import { Grid, List, Header } from "semantic-ui-react";
import { rightArrowIcon } from "./images";
import PropTypes from "prop-types";
import "./style.scss";

const QuestionList = ({ questionData }) => (
  <>
    <Grid stackable>
      <Grid.Column className="question-section-inner">
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
