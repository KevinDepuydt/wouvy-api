import { Router } from 'express';
import * as upload from '../controllers/uploads';

const uploadsRoutes = Router();

uploadsRoutes.route('/upload').post(upload.uploadFile);

uploadsRoutes.route('/upload/:filename').delete(upload.deleteFile);

export default uploadsRoutes;
