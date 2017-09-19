import { Router } from 'express';
import * as news from '../controllers/news';

const newsRoutes = Router();

newsRoutes.route('/newss')
  .get(news.list)
  .post(news.create);

newsRoutes.route('/newss/:newsId')
  .get(news.read)
  .put(news.update)
  .delete(news.remove);

newsRoutes.param('newsId', news.newsByID);

export default newsRoutes;
