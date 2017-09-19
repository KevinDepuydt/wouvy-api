import { Router } from 'express';
import * as member from '../controllers/members';

const membersRoutes = Router();

membersRoutes.route('/members')
  .get(member.list)
  .post(member.create);

membersRoutes.route('/members/:memberId')
  .get(member.read)
  .put(member.update)
  .delete(member.remove);

membersRoutes.param('memberId', member.memberByID);

export default membersRoutes;
