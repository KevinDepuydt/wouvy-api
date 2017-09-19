import { Router } from 'express';
import * as thread from '../controllers/threads';

const threadsRoutes = Router();

threadsRoutes.route('/threads')
  .get(thread.list)
  .post(thread.create);

threadsRoutes.route('/threads/:threadId')
  .get(thread.read)
  .put(thread.update)
  .delete(thread.remove);

threadsRoutes.param('threadId', thread.threadByID);

export default threadsRoutes;
