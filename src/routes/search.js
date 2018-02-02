import { Router } from 'express';
import * as search from '../controllers/search';

const searchRoutes = Router();

searchRoutes.route('/search/users').post(search.searchUsers);

export default searchRoutes;
