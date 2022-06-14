import React from "react";
import { Grid } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./style.scss";

const QAndAPair = ({ question }) => (
  <>
    <Grid stackable centered className="question-section">
      <Grid.Column className="question-text">
        {question.questionText}
      </Grid.Column>
    </Grid>
    <Grid stackable centered className="answer-section column-b ">
      <Grid.Column
        className="answer-text"
        dangerouslySetInnerHTML={{ __html: `${question.answerText}` }}
      ></Grid.Column>
    </Grid>
  </>
);

QAndAPair.propTypes = {
  question: PropTypes.object.isRequired,
};

export default QAndAPair;
