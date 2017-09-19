import { Router } from 'express';
import * as photo from '../controllers/photos';

const photosRoutes = Router();

photosRoutes.route('/photos')
  .get(photo.list)
  .post(photo.create);

photosRoutes.route('/photos/:photoId')
  .get(photo.read)
  .put(photo.update)
  .delete(photo.remove);

photosRoutes.param('photoId', photo.photoByID);

export default photosRoutes;
