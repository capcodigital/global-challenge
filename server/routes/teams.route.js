
import express from 'express';
import {
  list, create, update
} from '../controllers/teams.controller';

const router = express.Router();

module.exports = () => {
  // Team Routes
  router.get('/list', list);
  router.get('/', all);
  router.post('/', create);
  router.put('/', update);

  return router;
};
