import { Router } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import * as authentication from '../controllers/authentication';

const authenticationRoutes = Router();

authenticationRoutes.route('/authentication/subscribe').post(authentication.subscribe);
authenticationRoutes.route('/authentication/login').post(authentication.login);

// authentication middleware
authenticationRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-api-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, env.jwtSecret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token return an 403 error
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
});

export default authenticationRoutes;
