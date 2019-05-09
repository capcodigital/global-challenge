
import express from 'express';
const router = express.Router();
const users = require('../../app/controllers/users');

module.exports = () => {
  // User Routes
  router.get('/userStats', users.stats);
  router.get('/activities', users.activities);
  router.get('/citUpdate', users.citUpdate);
  router.get('/addManual', users.addManual);

  return router;
};
