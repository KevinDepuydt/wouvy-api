import { Router } from 'express';
import * as workflow from '../controllers/workflows';
import * as workflowUsers from '../controllers/workflow-users';

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

workflowsRoutes.route('/workflow-subscribe')
  .get(workflow.subscribe);

// Workflow users
workflowsRoutes.route('/workflows/:workflowId/users')
  .get(workflowUsers.listUsers)
  .post(workflowUsers.addUser);

workflowsRoutes.route('/workflows/:workflowId/users/:userId')
  .get(workflowUsers.readUser)
  .put(workflowUsers.updateUser)
  .delete(workflowUsers.removeUser);

workflowsRoutes.route('/workflows/:workflowId/users/:userId/roles')
  .put(workflowUsers.updateUserRole);

// Finish by binding the Workflow middleware
workflowsRoutes.param('workflowId', workflow.workflowByID);

export default workflowsRoutes;
