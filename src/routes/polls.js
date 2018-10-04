import { Router } from 'express';
import * as polls from '../controllers/polls';
import { workflowByID } from '../controllers/workflows';

const pollsRoutes = Router();

pollsRoutes.route('/workflows/:workflowId/polls')
  .get(polls.list)
  .post(polls.create);

pollsRoutes.route('/workflows/:workflowId/polls/:pollId')
  .get(polls.read)
  .put(polls.update)
  .delete(polls.remove);

pollsRoutes.param('workflowId', workflowByID);
pollsRoutes.param('pollId', polls.pollByID);

export default pollsRoutes;
