import { Router } from 'express';
import * as workflow from '../controllers/workflows';

const workflowsRoutes = Router();

// Workflows Routes
workflowsRoutes.route('/api/workflows')
  .get(workflow.list)
  .post(workflow.create);

workflowsRoutes.route('/api/workflows/:workflowId')
  .get(workflow.read)
  .put(workflow.update)
  .delete(workflow.remove);

workflowsRoutes.route('/api/workflows/:workflowId/possible-members').get(workflow.listPossibleMembers);

workflowsRoutes.route('/api/workflows/:workflowId/generate-access-token').get(workflow.generateAccessToken);

workflowsRoutes.route('/api/user-workflows').get(workflow.listForUser);

workflowsRoutes.route('/api/search-workflows').get(workflow.search);

workflowsRoutes.route('/api/workflows-by-token').get(workflow.getByToken);

// Finish by binding the Workflow middleware
workflowsRoutes.param('workflowId', workflow.workflowByIdOrSlug);

export default workflowsRoutes;
