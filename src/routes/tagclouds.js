import { Router } from 'express';
import * as tagCloud from '../controllers/tagclouds';

const tagCloudsRoutes = Router();

tagCloudsRoutes.route('/tag-clouds')
  .get(tagCloud.list)
  .post(tagCloud.create);

tagCloudsRoutes.route('/tag-clouds/:tagCloudId')
  .get(tagCloud.read)
  .put(tagCloud.update)
  .delete(tagCloud.remove);

tagCloudsRoutes.param('tagCloudId', tagCloud.tagCloudByID);

export default tagCloudsRoutes;
