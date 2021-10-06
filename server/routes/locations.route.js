
import express from 'express';
import {
  list, all
} from '../controllers/locations.controller';

const router = express.Router();

module.exports = () => {
  // Location Routes
  router.get('/list', list);
  router.get('/', all);

  return router;
};
