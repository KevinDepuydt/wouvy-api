import { Router } from 'express';
import * as thread from '../controllers/threads';
import { workflowByID } from '../controllers/workflows';

const threadsRoutes = Router();

threadsRoutes.route('/workflows/:workflowId/threads')
  .get(thread.list)
  .post(thread.create);

threadsRoutes.route('/workflows/:workflowId/threads/:threadId')
  .get(thread.read)
  .put(thread.update)
  .delete(thread.remove);

threadsRoutes.route('/workflows/:workflowId/threads/:threadId/messages')
  .get(thread.getMessages)
  .post(thread.addMessage);

threadsRoutes.param('workflowId', workflowByID);
threadsRoutes.param('threadId', thread.threadByID);

export default threadsRoutes;
