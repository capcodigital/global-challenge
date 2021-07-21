/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Header, Grid } from "semantic-ui-react";
import QAndAPair from "./QAndAPair.component";
import { questionData } from "./questionData";
import "./style.scss";

function FaqPage() {
  return (
    <>
      <Grid className="faq-container" stackable centered>
        <Grid.Column className="column-a"></Grid.Column>
        <Grid.Column className="faq-section column-b">
          <Header className="faq-title">FAQ</Header>
          <>
            <Header className="section-header">
              General
            </Header>
            {questionData.general.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
            <Header className="section-header">
              Team
            </Header>
            {questionData.team.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
            <Header className="section-header">
              Data
            </Header>
            {questionData.data.map((question) => (
              <QAndAPair key={question.questionId} question={question} />
            ))}
          </>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default FaqPage;
