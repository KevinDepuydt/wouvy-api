import { Router } from 'express';
import * as document from '../controllers/documents';
import { workflowByID } from '../controllers/workflows';

const documentsRoutes = Router();

documentsRoutes.route('/workflows/:workflowId/documents')
  .get(document.list)
  .post(document.create);

documentsRoutes.route('/workflows/:workflowId/documents/:documentId')
  .get(document.read)
  .put(document.update)
  .delete(document.remove);

documentsRoutes.param('workflowId', workflowByID);
documentsRoutes.param('documentId', document.documentByID);

export default documentsRoutes;
