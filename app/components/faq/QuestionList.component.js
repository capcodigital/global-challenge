import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import './style.scss';
import { rightArrowIcon } from "./images";

const QuestionList = (props) => (
  <React.Fragment>
    <Grid stackable centered className='question-list' style={{ paddingTop: '2rem' }}>
      <Grid.Column width={8} style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        <List>
          <React.Fragment>
            {props.questionData.map((data) => (
              <List.Item><img src={rightArrowIcon} alt="Next arrow" /> <a href={"#" + data.questionId}>{data.questionText}</a></List.Item>
            ))}
          </React.Fragment>
        </List>
      </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default QuestionList;