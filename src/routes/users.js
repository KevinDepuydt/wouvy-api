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

usersRoutes.route('/users/:userId/validate').get(user.validate);

usersRoutes.route('/users/:userId/credentials').put(user.updateCredentials);

usersRoutes.param('userId', user.userByID);

export default usersRoutes;
