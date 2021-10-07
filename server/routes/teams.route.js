
import express from 'express';
import {list, create, update, all, teamMembers, notInATeam } from '../controllers/teams.controller';

const router = express.Router();

module.exports = () => {
  // Team Routes
  router.get('/list', list);
  router.get('/teamMembers', teamMembers);
  router.get('/notInATeam', notInATeam);
  router.get('/', all);
  router.post('/', create);
  router.put('/', update);

  return router;
};
