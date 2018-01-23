import { Router } from 'express';
import * as workflow from '../controllers/workflows';

const workflowsRoutes = Router();

// extra routes
workflowsRoutes.route('/workflows/search').get(workflow.search);

// Workflows Routes
workflowsRoutes.route('/workflows')
  .get(workflow.list)
  .post(workflow.create);

workflowsRoutes.route('/workflows/:workflowId/authenticate')
  .post(workflow.authenticate);

workflowsRoutes.route('/workflows/:workflowId')
  .get(workflow.read)
  .put(workflow.update)
  .delete(workflow.remove);

// other routes
workflowsRoutes.route('/workflows/:workflowId/possible-members').get(workflow.listPossibleMembers);

// Finish by binding the Workflow middleware
workflowsRoutes.param('workflowId', workflow.workflowByIdOrSlug);

export default workflowsRoutes;
