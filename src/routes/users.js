import { Router } from 'express';
import * as user from '../controllers/users';

const usersRoutes = Router();

usersRoutes.route('/users')
  .get(user.list)
  .post(user.create);

usersRoutes.route('/users/:userId')
  .get(user.read)
  .put(user.update)
  .delete(user.remove);

usersRoutes.route('/users/:userId/password').put(user.updatePassword);

usersRoutes.param('userId', user.userByID);

export default usersRoutes;
