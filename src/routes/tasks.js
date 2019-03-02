import { Router } from 'express';
import * as task from '../controllers/tasks';
import { workflowByID } from '../controllers/workflows';

const tasksRoutes = Router();

tasksRoutes.route('/workflows/:workflowId/tasks')
  .get(task.list)
  .post(task.create)
  .put(task.updateMany);

tasksRoutes.route('/workflows/:workflowId/tasks/:taskId')
  .get(task.read)
  .put(task.update)
  .delete(task.remove);

tasksRoutes.param('workflowId', workflowByID);
tasksRoutes.param('taskId', task.taskByID);

export default tasksRoutes;
