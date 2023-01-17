const path = require('path');
const util = require("util");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createFsFromVolume, Volume } = require("memfs");

var users = require('../controllers/users.controller');
var teams = require('../controllers/teams.controller');
var challenges = require('../controllers/challenges.controller');
var fitbit = require('../controllers/fitbit.controller');
var strava = require('../controllers/strava.controller');
var levels = require('../controllers/levels.controller');
var locations = require('../controllers/locations.controller');

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const fs = createFsFromVolume(new Volume());
  fs.join = path.join.bind(path);
  const readFile = util.promisify(fs.readFile);

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: "errors-only",
    outputFileSystem: fs,
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('/users/userStats', users.stats);
  app.get('/users/list', users.list);
  app.get('/users', users.all);

  app.get('/users/inactiveUsers', users.inactiveUsers);

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
  app.get('/locations', locations.all);

  app.get("*", async (req, res) => {
    try {
      const file = await readFile(path.join(compiler.outputPath, "index.html"));
      res.send(file.toString());
    } catch (error) {
      res.sendStatus(404);
    }
  });
};
