
import express from 'express';
import { authorize, update, updateIndividualUser } from '../controllers/fitbit.controller';

const router = express.Router();

module.exports = () => {
  // Moves Service Routes
  router.get('/auth', authorize);
  router.get('/update', update);
  router.get('userUpdate/:user', updateIndividualUser);

  return router;
};
