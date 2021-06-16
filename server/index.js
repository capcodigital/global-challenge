/* eslint consistent-return:0 */

const express = require('express');
const fs = require('fs');
const cluster = require('cluster');
const constants = require('constants');
const https = require('https');
const numCPUs = require('os').cpus().length;
const { resolve } = require('path');
const logger = require('./util//logger');
const bodyParser = require('body-parser');

const argv = require('./util/argv');
const port = require('./util//port');
const setup = require('./middlewares/frontendMiddleware');

var models = require("./config/models");

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
 	outputPath: resolve(process.cwd(), 'build'),
 	publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

if (env === 'production') {
	if (cluster.isMaster) {
		console.log('Master Process Started');

		// Fork workers.
		for (var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on('exit', function(worker, code, signal) {
			console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
			cluster.fork();
		});
  } else {
      // Create an HTTPS service.
      app.listen(port, host, (err) => {
			if (err) {
				return logger.error(err.message);
			}
			logger.appStarted(port, prettyHost);
		});
      console.log('Worker ' + cluster.worker.id + ' Express app started on port ' + port);
  }
} else {
  	// Create an HTTPS service.
	app.listen(port, host, (err) => {
		if (err) {
			return logger.error(err.message);
		}
		logger.appStarted(port, prettyHost);
	});
}
