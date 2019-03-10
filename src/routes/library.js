import { Router } from 'express';
import { workflowByID } from '../controllers/workflows';
import * as library from '../controllers/library';

const libraryRoutes = Router();

// library (library is a folder with isRoot = true)
libraryRoutes.route('/workflows/:workflowId/library')
  .get(library.getWorkflowLibrary);

// folder's documents
libraryRoutes.route('/workflows/:workflowId/folders/:parentFolderId/documents')
  .post(library.createDocument);

libraryRoutes.route('/workflows/:workflowId/folders/:parentFolderId/documents/:documentId')
  .get(library.readDocument)
  .put(library.updateDocument)
  .delete(library.removeDocument);

// folder's folders
libraryRoutes.route('/workflows/:workflowId/folders/:parentFolderId/folders')
  .get(library.readFolder)
  .post(library.createFolder);

libraryRoutes.route('/workflows/:workflowId/folders/:parentFolderId/folders/:folderId')
  .get(library.readFolder)
  .put(library.updateFolder)
  .delete(library.removeFolder);

libraryRoutes.param('workflowId', workflowByID);
libraryRoutes.param('parentFolderId', library.parentFolderByID);
libraryRoutes.param('folderId', library.folderByID);
libraryRoutes.param('documentId', library.documentByID);

export default libraryRoutes;
