
import express from 'express';
import {
  stats, all, addManual, list
} from '../controllers/users.controller';

const router = express.Router();

module.exports = () => {
  // User Routes
  router.get('/userStats', stats);
  router.get('/list', list);
  router.get('/addManual', addManual);
  router.get('/inactiveUsers', inactiveUsers);
  router.get('/', all);

  return router;
};
