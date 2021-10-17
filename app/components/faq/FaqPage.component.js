/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Header, Grid, Divider, Segment, Container } from "semantic-ui-react";
import QAndAPair from "./QAndAPair.component";
import { questionData } from "./questionData";
import "./style.scss";

const challenge_name = process.env.CHALLENGE_NAME
  ? `${process.env.CHALLENGE_NAME}`
  : "global";

function FaqPage() {
  return (
    <Container>
    <Segment vertical>
      <Grid className={`faq-container ${challenge_name}`} stackable
            centered>
        <Grid.Column className={`faq-section ${challenge_name}`} style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
            width={16}>
          {challenge_name === "global" && (
            <>
              <Header className="faq-title">FAQ</Header>
              <Header className="section-header">General</Header>
              <Divider />
              {questionData.general.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
              <Header className="section-header">Tracking Activity</Header>
              <Divider />
              {questionData.trackingActivity.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
              <Header className="section-header">Participating as a Team</Header>
              <Divider />
              {questionData.team.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
              <Header className="section-header">Data</Header>
              <Divider />
              {questionData.data.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
            </>
          )}
          {challenge_name === "uk" && (
            <>
              <Header className="faq-title">FAQ</Header>
              <Header className="section-header">General</Header>
              <Divider />
              {questionData.general.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
              <Header className="section-header">Team</Header>
              <Divider />
              {questionData.team.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
              <Header className="section-header">Data</Header>
              <Divider />
              {questionData.data.map((question) => (
                <QAndAPair key={question.questionId} question={question} />
              ))}
            </>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
    </Container>
  );
}

export default FaqPage;
