const path = require('path');
const express = require('express');
const compression = require('compression');

var users = require('../controllers/users.controller');
var fitbit = require('../controllers/fitbit.controller');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('/users/userStats', users.stats);

  app.get('/users/activities', users.activities);

  app.get('/users/citUpdate', users.citUpdate);

  app.get('/users/addManual', users.addManual);

  app.get('/fitbit/auth', fitbit.authorize);

  app.get('/fitbit/update', fitbit.update);

  app.get('/fitbit/userUpdate/:user', fitbit.updateUser);

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};
