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
import EventRules from './EventRules.component';
import AboutChallenge from './AboutChallenge.component';
import SetupInstructions from './SetupInstructions.component';
import StravaSetupInstructions from './StravaSetupInstructions.component';

function FaqPage() {
  return(
    <div className="faq">
      <Container>
        <Segment style={{ padding: '10' }} vertical>
          <Header as='h1' textAlign='center' icon>
            <Icon name='question'/>
              FREQUENTLY ASKED QUESTIONS
            <Header.Subheader >
              Find answers to your burning questions
            </Header.Subheader>
          </Header>
          <QuestionList
            questionData={questionData}
          />
          <EventRules/>
          <AboutChallenge/>
          <SetupInstructions/>
          <StravaSetupInstructions/>
          <React.Fragment>
            <Header as='h1' textAlign='center'>General</Header>
            {questionData.general.map((question) => (
                <QAndASection
                  key={question.questionId}
                  questionId={question.questionId}
                  questionText={question.questionText}
                  answerText={question.answerText}
                />
              )
            )}
            <Header as='h1' textAlign='center'>Team</Header>
            {questionData.team.map((question) => (
                <QAndASection
                  key={question.questionId}
                  questionId={question.questionId}
                  questionText={question.questionText}
                  answerText={question.answerText}
                />
              )
            )}
            <Header as='h1' textAlign='center'>Data</Header>
            {questionData.data.map((question) => (
                <QAndASection
                  key={question.questionId}
                  questionId={question.questionId}
                  questionText={question.questionText}
                  answerText={question.answerText}
                />
              )
            )}
          </React.Fragment>
        </Segment>
      </Container>
    </div>
  )
};

export default FaqPage;
