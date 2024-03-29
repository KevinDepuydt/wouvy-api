import { Router } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import * as authentication from '../controllers/authentication';

const authenticationRoutes = Router();

authenticationRoutes.route('/auth/signup').post(authentication.signup);
authenticationRoutes.route('/auth/signin').post(authentication.signin);
authenticationRoutes.route('/auth/forgot-password').post(authentication.forgotPassword);
authenticationRoutes.route('/auth/new-password').post(authentication.newPassword);

// Facebook authentication
authenticationRoutes.route('/auth/facebook').get(authentication.socialAuth('facebook', {
  scope: ['email'],
}));
authenticationRoutes.route('/auth/facebook/callback').get(authentication.socialAuthCallback('facebook'));

// Google authentication
authenticationRoutes.route('/auth/google').get(authentication.socialAuth('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}));
authenticationRoutes.route('/auth/google/callback').get(authentication.socialAuthCallback('google'));

// Linkedin authentication
authenticationRoutes.route('/auth/linkedin').get(authentication.socialAuth('linkedin', {
  scope: [
    'r_basicprofile',
    'r_emailaddress',
  ],
}));
authenticationRoutes.route('/auth/linkedin/callback').get(authentication.socialAuthCallback('linkedin'));

// Twitter authentication
authenticationRoutes.route('/auth/twitter').get(authentication.socialAuth('twitter'));
authenticationRoutes.route('/auth/twitter/callback').get(authentication.socialAuthCallback('twitter'));

// Github authentication
authenticationRoutes.route('/auth/github').get(authentication.socialAuth('github', {
  scope: 'user:email',
}));
authenticationRoutes.route('/auth/github/callback').get(authentication.socialAuthCallback('github'));

// authentication middleware
authenticationRoutes.use((req, res, next) => {
  // disable for tests and options
  if (env.nodeEnv === 'test' || req.method === 'OPTIONS') {
    return next();
  }

  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    return res.status(401).json({ message: 'authentication missing' });
  }

  // check header or url parameters or post parameters for token
  const token = req.headers.authorization.split(' ')[1];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, env.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ success: false, message: 'authentication failed' });
      }
      req.user = decoded._doc;
      next();
    });
  } else {
    // if there is no token return an 403 error
    return res.status(403).send({ message: 'not allowed' });
  }
});

export default authenticationRoutes;
