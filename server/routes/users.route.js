
import express from 'express';
import {
  stats, activities, citUpdate, addManual, list
} from '../controllers/users.controller';

const router = express.Router();

module.exports = () => {
  // User Routes
  router.get('/userStats', stats);
  router.get('/list', list);
  router.get('/activities', activities);
  router.get('/citUpdate', citUpdate);
  router.get('/addManual', addManual);

  return router;
};
