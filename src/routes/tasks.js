import { Router } from 'express';
import * as task from '../controllers/tasks';

const tasksRoutes = Router();

tasksRoutes.route('/tasks')
  .get(task.list)
  .post(task.create);

tasksRoutes.route('/tasks/:taskId')
  .get(task.read)
  .put(task.update)
  .delete(task.remove);

tasksRoutes.param('taskId', task.taskByID);

export default tasksRoutes;
