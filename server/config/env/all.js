var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: 6060,
    db: process.env.MONGOHQ_URL,
    minTeamSize: 4,
    maxTeamSize: 4,
    cyclingConversion: 3
}
