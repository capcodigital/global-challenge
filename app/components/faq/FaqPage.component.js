/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Segment, Header, Container, Icon } from "semantic-ui-react";
import QAndAPair from "./QAndAPair.component";
import QuestionList from "./QuestionList.component";
import { questionData } from "./questionData";
import "./style.scss";
import EventRules from "./EventRules.component";
import AboutChallenge from "./AboutChallenge.component";
import SetupInstructions from "./SetupInstructions.component";
import StravaSetupInstructions from "./StravaSetupInstructions.component";
import QuickLinkMenu from "./QuickLinkMenu.component";

function FaqPage() {
  return (
    <div className="faq">
      <Container>
        <Segment vertical>
          <Header as="h1" textAlign="center" icon>
            <Icon name="question" />
            FREQUENTLY ASKED QUESTIONS
            <Header.Subheader>
              Find answers to your burning questions
            </Header.Subheader>
          </Header>
          <QuestionList questionData={questionData} />
          <AboutChallenge />
          <EventRules />
          <SetupInstructions />
          <StravaSetupInstructions />
          <>
            <Header as="h1" textAlign="center">
              General
            </Header>
            {questionData.general.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
            <Header as="h1" textAlign="center">
              Team
            </Header>
            {questionData.team.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
            <Header as="h1" textAlign="center">
              Data
            </Header>
            {questionData.data.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
          </>
        </Segment>
      </Container>
    </div>
  );
}

export default FaqPage;
