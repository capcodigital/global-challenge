import path from 'path';

const rootPath = path.normalize(`${__dirname}/../..`);

module.exports = {
  root: rootPath,
  daysBetweenForcedPasswordChange: 365,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL
};
