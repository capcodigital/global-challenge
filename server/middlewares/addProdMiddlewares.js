const path = require('path');
const express = require('express');
const compression = require('compression');

var users = require('../controllers/users.controller');
var teams = require('../controllers/teams.controller');
var challenges = require('../controllers/challenges.controller');
var fitbit = require('../controllers/fitbit.controller');
var strava = require('../controllers/strava.controller');
var levels = require('../controllers/levels.controller');
var locations = require('../controllers/locations.controller');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('/users/userStats', users.stats);
  app.get('/users/list', users.list);
  app.get('/users', users.all);
  app.get('/users/remove', users.removeById);
  app.get('/users/inactiveUsers', users.inactiveUsers);
  app.get('/users/userAppTotals', users.userAppTotals);

  // app.get('/users/addManual', users.addManual);

  app.get('/teams/list', teams.list);
  app.get('/teams', teams.all);
  app.post('/teams', teams.create);
  app.put('/teams', teams.update);
  app.get('/teams/teamMembers', teams.teamMembers);
  app.get('/teams/notInATeam', teams.notInATeam);
  app.get('/teams/remove', teams.removeById);

  app.get('/challenges/list', challenges.list);
  app.get('/challenges', challenges.get);
  app.post('/challenges', challenges.create);
  app.put('/challenges', challenges.update);

  app.get('/fitbit/auth', fitbit.authorize);
  app.get('/fitbit/update', fitbit.update);
  app.get('/fitbit/userUpdate/:user', fitbit.updateIndividualUser);

  app.get('/strava/auth', strava.authorize);
  app.get('/strava/update', strava.update);

  // app.get('/strava/userUpdate/:user', strava.updateIndividualUser);

  app.get('/levels/list', levels.list);
  app.get('/levels', levels.all);

  app.get('/locations/list', locations.list);
  app.get('/locations', telocationsams.all);

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};
