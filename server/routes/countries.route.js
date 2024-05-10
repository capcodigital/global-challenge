
import express from 'express';
import {
  list, all
} from '../controllers/countries.controller';

const router = express.Router();

module.exports = () => {
  // Country Routes
  router.get('/list', list);
  router.get('/', all);

  return router;
};
