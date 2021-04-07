
import express from 'express';
import {
  list, create, update
} from '../controllers/challenges.controller';

const router = express.Router();

module.exports = () => {
  // Team Routes
  router.get('/list', list);
  router.get('/', get);
  router.post('/', create);
  router.put('/', update);

  return router;
};
