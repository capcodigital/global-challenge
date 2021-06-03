import React from 'react';
import { Grid } from 'semantic-ui-react';
import './style.scss';

const QAndAPair = (props) => (
  <React.Fragment>
    <Grid stackable centered className='question-section' style={{ paddingTop: '2rem' }}>
      <Grid.Column id={props.questionId} width={2} className='question-letter' textAlign='center' style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
        Q.
      </Grid.Column>
      <Grid.Column width={10} className='question-text'>
        {props.questionText}
      </Grid.Column>
    </Grid>
    <Grid stackable centered style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
      <Grid.Column width={2} className='answer-letter' textAlign='center' style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
        A.
      </Grid.Column>
      <Grid.Column width={10} className='answer-text'>
        {props.answerText}
      </Grid.Column>
    </Grid>
  </React.Fragment>
);

export default QAndAPair;