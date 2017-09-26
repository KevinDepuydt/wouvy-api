import { Router } from 'express';
import * as news from '../controllers/news';

const newsRoutes = Router();

newsRoutes.route('/news')
  .get(news.list)
  .post(news.create);

newsRoutes.route('/news/:newsId')
  .get(news.read)
  .put(news.update)
  .delete(news.remove);

newsRoutes.param('newsId', news.newsByID);

export default newsRoutes;
