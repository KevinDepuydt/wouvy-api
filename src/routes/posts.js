import { Router } from 'express';
import * as posts from '../controllers/posts';
import { workflowByID } from '../controllers/workflows';

const postsRoutes = Router();

postsRoutes.route('/workflows/:workflowId/posts')
  .get(posts.list)
  .post(posts.create);

postsRoutes.route('/workflows/:workflowId/posts/:postId')
  .get(posts.read)
  .put(posts.update)
  .delete(posts.remove);

postsRoutes.param('workflowId', workflowByID);
postsRoutes.param('postId', posts.postByID);

export default postsRoutes;
