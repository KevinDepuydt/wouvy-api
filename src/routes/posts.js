import { Router } from 'express';
import * as post from '../controllers/posts';
import { workflowByID } from '../controllers/workflows';

const postsRoutes = Router();

postsRoutes.route('/workflows/:workflowId/posts')
  .get(post.list)
  .post(post.create);

postsRoutes.route('/workflows/:workflowId/posts/:postId')
  .get(post.read)
  .put(post.update)
  .delete(post.remove);

postsRoutes.param('workflowId', workflowByID);
postsRoutes.param('postId', post.postByID);

export default postsRoutes;
