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

var options = {
 	secureProtocol: 'SSLv23_method',
 	secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_TLSv1
}

if (env === 'production') {
	options.key = fs.readFileSync('/home/ec2-user/dist/config/keys/private-key.pem');
	options.cert = fs.readFileSync('/home/ec2-user/dist/config/keys/ee0cc8226e7cd1f4.crt');
	options.ca = [fs.readFileSync('/home/ec2-user/dist/config/keys/gd_bundle-split1.crt'),
	    fs.readFileSync('/home/ec2-user/dist/config/keys/gd_bundle-split2.crt'),
	    fs.readFileSync('/home/ec2-user/dist/config/keys/gd_bundle-split3.crt')];
} else {
	options.key = fs.readFileSync('config/keys/myrsakey.pem');
	options.cert = fs.readFileSync('config/keys/myrsacert.pem');
}

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
      https.createServer(options, app).listen(port, host, (err) => {
			if (err) {
				return logger.error(err.message);
			}
			logger.appStarted(port, prettyHost);
		});
      console.log('Worker ' + cluster.worker.id + ' Express app started on port ' + port);
  }
} else {
  	// Create an HTTPS service.
	https.createServer(options, app).listen(port, host, (err) => {
		if (err) {
			return logger.error(err.message);
		}
		logger.appStarted(port, prettyHost);
	});
}
