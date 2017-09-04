import { Router } from 'express';
import * as user from '../controllers/users';

const usersRoutes = Router();

usersRoutes.route('/')
  .get(user.list)
  .post(user.create);

usersRoutes.route('/:userId')
  .get(user.read)
  .put(user.update)
  .delete(user.remove);

usersRoutes.param('userId', user.userByID);

export default usersRoutes;
