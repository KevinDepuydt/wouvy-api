import { Router } from 'express';
import * as search from '../controllers/search';
import { workflowByID } from '../controllers/workflows';

const searchRoutes = Router();

searchRoutes.route('/workflows/:workflowId/search/users').post(search.searchUsers);
searchRoutes.route('/workflows/:workflowId/search/user').post(search.searchUserByEmail);

searchRoutes.param('workflowId', workflowByID);

export default searchRoutes;
