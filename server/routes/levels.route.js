
import express from 'express';
import {
  list, all
} from '../controllers/levels.controller';

const router = express.Router();

module.exports = () => {
  // Level Routes
  router.get('/list', list);
  router.get('/', all);

  return router;
};
