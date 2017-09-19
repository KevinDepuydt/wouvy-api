import { Router } from 'express';
import * as sponsor from '../controllers/sponsors';

const sponsorsRoutes = Router();

sponsorsRoutes.route('/sponsors')
  .get(sponsor.list)
  .post(sponsor.create);

sponsorsRoutes.route('/sponsors/:sponsorId')
  .get(sponsor.read)
  .put(sponsor.update)
  .delete(sponsor.remove);

sponsorsRoutes.param('sponsorId', sponsor.sponsorByID);

export default sponsorsRoutes;
