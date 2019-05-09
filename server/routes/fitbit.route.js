
import  express from 'express';
const router = express.Router(),
import { authorize, update } from '../controllers/fitbit.controller';

module.exports = () => {
  // Moves Service Routes
  router.get('/auth', authorize);
  router.get('/update', update);
  
  return router;
};
