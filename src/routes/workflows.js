import { Router } from 'express';
import * as workflow from '../controllers/workflows';

const workflowsRoutes = Router();

// Workflows Routes
workflowsRoutes.route('/workflows')
  .get(workflow.list)
  .post(workflow.create);

workflowsRoutes.route('/workflows/:workflowId')
  .get(workflow.read)
  .put(workflow.update)
  .delete(workflow.remove);

workflowsRoutes.route('/workflows/:workflowId/possible-members').get(workflow.listPossibleMembers);

workflowsRoutes.route('/workflows/:workflowId/generate-access-token').get(workflow.generateAccessToken);

workflowsRoutes.route('/user-workflows').get(workflow.listForUser);

workflowsRoutes.route('/search-workflows').get(workflow.search);

workflowsRoutes.route('/workflows-by-token').get(workflow.getByToken);

// Finish by binding the Workflow middleware
workflowsRoutes.param('workflowId', workflow.workflowByIdOrSlug);

export default workflowsRoutes;
