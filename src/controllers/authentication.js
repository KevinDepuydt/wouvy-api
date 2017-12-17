import passport from 'passport';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import User from '../models/user';
import { getErrorMessage } from '../helpers/error-messages';

/**
 * Subscribe an User
 */
const signup = (req, res) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return res.status(500).send({ message: getErrorMessage(err) });
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
    // return the information including token as JSON
    res.json({ message: 'Inscription réussie!', token });
  });
};

/**
 * Login an User
 */
const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(500).send(info);
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
    // return the information including token as JSON
    res.json({ message: 'Connexion réussie!', token });
  })(req, res, next);
};

const socialAuth = (strategy, scope) => (req, res, next) => {
  // Authenticate
  passport.authenticate(strategy, scope)(req, res, next);
};

const socialAuthCallback = strategy => (req, res, next) => {
  passport.authenticate(strategy, (err, user) => {
    if (err || !user) {
      return res.redirect(`${env.appUrl}/oauth?error=${JSON.stringify(err)}`);
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
    // redirect to application with token a query parameters
    return res.redirect(`${env.appUrl}/oauth?token=${token}`);
  })(req, res, next);
};

export { signup, signin, socialAuth, socialAuthCallback };
