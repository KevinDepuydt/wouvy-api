import { Router } from 'express';
import * as workflow from '../controllers/workflows';

const workflowsRoutes = Router();

// extra routes
workflowsRoutes.route('/workflows/search').get(workflow.search);

// Workflows Routes
workflowsRoutes.route('/workflows')
  .get(workflow.list)
  .post(workflow.create);

workflowsRoutes.route('/workflows/:workflowId')
  .get(workflow.read)
  .put(workflow.update)
  .delete(workflow.remove);

// Workflow authenticate
workflowsRoutes.route('/workflows/:workflowId/authenticate')
  .post(workflow.authenticate);

// Workflow authenticate
workflowsRoutes.route('/workflows/:workflowId/leave')
  .get(workflow.leave);

// Workflow invitation
workflowsRoutes.route('/workflows/:workflowId/invitation')
  .post(workflow.invitation);

// Finish by binding the Workflow middleware
workflowsRoutes.param('workflowId', workflow.workflowByID);

export default workflowsRoutes;
