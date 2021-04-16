const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

var users = require('../controllers/users.controller');
var teams = require('../controllers/teams.controller');
var challenges = require('../controllers/challenges.controller');
var fitbit = require('../controllers/fitbit.controller');
var strava = require('../controllers/strava.controller');

function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath,
    silent: true,
    stats: 'errors-only'
  });
}

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const middleware = createWebpackMiddleware(compiler, webpackConfig.output.publicPath);

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  app.get('/users/userStats', users.stats);
  app.get('/users/list', users.list);
  app.get('/users/activities', users.activities);
  app.get('/users/citUpdate', users.citUpdate);

  // app.get('/users/addManual', users.addManual);

  app.get('/teams/list', teams.list);
  app.get('/teams', teams.all);
  app.post('/teams', teams.create);
  app.put('/teams', teams.update);

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

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};
