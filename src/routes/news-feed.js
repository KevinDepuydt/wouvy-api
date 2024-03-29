import { Router } from 'express';
import * as newsFeed from '../controllers/news-feed';
import { workflowByID } from '../controllers/workflows';

const newsFeedRoutes = Router();

newsFeedRoutes.route('/workflows/:workflowId/news-feed')
  .get(newsFeed.list)
  .post(newsFeed.create);

newsFeedRoutes.route('/workflows/:workflowId/news-feed/:newsFeedItemId')
  .get(newsFeed.read)
  .put(newsFeed.update)
  .delete(newsFeed.remove);

newsFeedRoutes.route('/workflows/:workflowId/news-feed/:newsFeedItemId/comments')
  .post(newsFeed.addComment);

newsFeedRoutes.route('/workflows/:workflowId/news-feed/:newsFeedItemId/comments/:commentId')
  .put(newsFeed.updateComment)
  .delete(newsFeed.removeComment);

newsFeedRoutes.param('workflowId', workflowByID);
newsFeedRoutes.param('newsFeedItemId', newsFeed.newsFeedItemByID);
newsFeedRoutes.param('commentId', newsFeed.commentByID);

export default newsFeedRoutes;
