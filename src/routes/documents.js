import { Router } from 'express';
import * as document from '../controllers/documents';

const documentsRoutes = Router();

documentsRoutes.route('/documents')
  .get(document.list)
  .post(document.create);

documentsRoutes.route('/documents/:documentId')
  .get(document.read)
  .put(document.update)
  .delete(document.remove);

documentsRoutes.param('documentId', document.documentByID);

export default documentsRoutes;
