import React from "react";
import { Grid } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./style.scss";

const QAndAPair = ({ question }) => (
  <>
    <Grid stackable centered className="question-section">
      <Grid.Column
        id={question.questionId}
        width={2}
        className="question-letter question-section-inner"
        textAlign="center"
      >
        Q.
      </Grid.Column>
      <Grid.Column width={10} className="question-text">
        {question.questionText}
      </Grid.Column>
    </Grid>
    <Grid stackable centered className="answer-section">
      <Grid.Column
        width={2}
        className="answer-letter answer-section"
        textAlign="center"
      >
        A.
      </Grid.Column>
      <Grid.Column
        width={10}
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
