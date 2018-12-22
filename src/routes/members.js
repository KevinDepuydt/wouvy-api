import { Router } from 'express';
import * as member from '../controllers/members';
import { workflowByID } from '../controllers/workflows';

const membersRoutes = Router();

membersRoutes.route('/workflows/:workflowId/members')
  .get(member.list)
  .post(member.create);

membersRoutes.route('/workflows/:workflowId/members/:userId')
  .get(member.read)
  .put(member.update);

// Workflow remove member
membersRoutes.route('/workflows/:workflowId/members/:userId')
  .delete(member.remove);

membersRoutes.param('workflowId', workflowByID);

export default membersRoutes;
