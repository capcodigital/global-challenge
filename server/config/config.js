import { extend } from 'underscore';

// Load app configuration
export default extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {});