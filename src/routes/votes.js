import { Router } from 'express';
import * as vote from '../controllers/votes';

const votesRoutes = Router();

votesRoutes.route('/votes')
  .get(vote.list)
  .post(vote.create);

votesRoutes.route('/votes/:voteId')
  .get(vote.read)
  .put(vote.update)
  .delete(vote.remove);

votesRoutes.param('voteId', vote.voteByID);

export default votesRoutes;
