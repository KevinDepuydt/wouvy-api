import { Router } from 'express';
import * as search from '../controllers/search';
import { workflowByID } from '../controllers/workflows';

const searchRoutes = Router();

searchRoutes.route('/workflows/:workflowId/search/users').post(search.searchUsers);

searchRoutes.param('workflowId', workflowByID);

export default searchRoutes;
