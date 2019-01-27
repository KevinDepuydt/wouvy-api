import { Router } from 'express';
import * as upload from '../controllers/uploads';

const uploadsRoutes = Router();

uploadsRoutes.route('/upload')
  .post(upload.upload.single('file'), upload.awsUploadFile)
  .delete(upload.awsDeleteObject);

export default uploadsRoutes;
