import { Router } from 'express';
import * as right from '../controllers/rights';

const rightsRoutes = Router();

rightsRoutes.route('/rights').get(right.list);

export default rightsRoutes;
