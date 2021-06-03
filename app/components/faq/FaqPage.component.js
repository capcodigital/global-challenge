/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
    Segment, Header, Container, Icon
} from 'semantic-ui-react';
import QAndASection from './QAndAPair.component';
import QuestionList from './QuestionList.component';
import { questionData } from "./questionData"
import './style.scss';

const FaqPage = () => (
  <div className="faq">
    <Container>
      <Segment style={{ padding: '10' }} vertical>
        <Header as='h2' textAlign='center' icon>
          <Icon name='question'/>
            FREQUENTLY ASKED QUESTIONS
          <Header.Subheader >
            Find answers to your burning questions
          </Header.Subheader>
        </Header>
        <QuestionList
          questionData={questionData}
        />
        <React.Fragment>
          {questionData.map((data) => (
              <QAndASection 
                questionId={data.questionId}
                questionText={data.questionText}
                answerText={data.answerText}
              />
            )
          )}
        </React.Fragment>
      </Segment>
    </Container>
  </div>
);

export default FaqPage;
