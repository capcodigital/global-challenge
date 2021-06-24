/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "components/header";
import Footer from "components/footer";

import HomePage from "components/homepage/homepage.container";
import "./style.scss";
import Dashboard, { TeamsDashboard } from "./dashboard/dashboard.container";
import TeamsPage from "./teams/teams.container";
import FaqPage from "./faq/FaqPage.component";

const App = () => (
  <div className="app-wrapper">
    <Helmet
      titleTemplate="%s - Capco Global Challenge"
      defaultTitle="Capco Global Challenge"
    >
      <meta name="description" content="Capco Global Challenge" />
    </Helmet>
    <Router>
      <Header />
      <Switch>
        <Route path="/register" exact component={HomePage} />
        <Route exact path="/" component={Dashboard} />
        <Route path="/team" component={TeamsDashboard} />
        <Route exact path="/teams/register" component={TeamsPage} />
        <Route exact path="/faq" component={FaqPage} />
        <Route component={HomePage} />
      </Switch>
      <Footer />
    </Router>
  </div>
);

export default App;
