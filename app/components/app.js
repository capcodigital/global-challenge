/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import Header from 'components/header';
import HomePage from 'components/homepage/homepage.container';
import './style.scss';
import Dashboard from './dashboard/dashboard.component';

const App = () => (
  <div className="app-wrapper">
    <Helmet
      titleTemplate="%s - Capco Global Step Challenge"
      defaultTitle="Capco Global Step Challenge"
    >
      <meta name="description" content="Capco Global Step Challenge" />
    </Helmet>
    <Header />
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/progress" component={Dashboard} />
    </Switch>
  </div>
);

export default App;
