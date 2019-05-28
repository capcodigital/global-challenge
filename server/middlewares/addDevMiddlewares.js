const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

var users = require('../controllers/users.controller');
var fitbit = require('../controllers/fitbit.controller');

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

  app.get('/users/userStats', (req, res) => {
    res.sendFile(path.resolve(outputPath, 'index.html'));
  });

  app.get('/users/activities', (req, res) => {
    console.log("activities");
    users.activities(req, res);
  });

  app.get('/users/citUpdate', (req, res) => {
    res.sendFile(path.resolve(outputPath, 'index.html'));
  });

  app.get('/users/addManual', (req, res) => {
    res.sendFile(path.resolve(outputPath, 'index.html'));
  });

  app.get('/fitbit/auth', (req, res) => {
    res.sendFile(path.resolve(outputPath, 'index.html'));
  });

  app.get('/fitbit/update', (req, res) => {
    res.sendFile(path.resolve(outputPath, 'index.html'));
  });

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
