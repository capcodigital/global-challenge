/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider } from 'react-intl';
import App from 'components/app';
import enMessages from './messages/messages_EN.json';
import 'semantic-ui-css/semantic.min.css';
import 'sanitize.css/sanitize.css';

// Load the favicon and apple touch icon
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon.png';
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS reset and Global Styles
import 'styles/theme.scss';

import configureStore from './configureStore';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
const root = createRoot(MOUNT_NODE);

const renderApp = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <IntlProvider locale="en" messages={enMessages}>
        <App />
      </IntlProvider>
    </ConnectedRouter>
  </Provider>
);

root.render(renderApp());

// Refresh every hour to pick up the latest updates
var hourlyRefresh = 60 * 60 * 1000;

setInterval(function(){
  document.location.reload();
}, hourlyRefresh);
