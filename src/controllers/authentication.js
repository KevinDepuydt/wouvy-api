import passport from 'passport';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import User from '../models/user';

/**
 * Subscribe an User
 */
const signup = (req, res) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
    // login and return the information including token as JSON
    req.login(user, (loginErr) => {
      if (loginErr) {
        res.status(400).send({ message: loginErr });
      } else {
        res.json({ message: 'Local signup successful!', user, token });
      }
    });
  });
};

/**
 * Login an User
 */
const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).send(info);
    }
    // delete user password for security
    user.password = undefined;
    // create a token to authenticate user api call
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
    // login and return the information including token as JSON
    req.login(user, (loginErr) => {
      if (loginErr) {
        res.status(400).send({ message: loginErr });
      } else {
        res.json({ message: 'Local signin successful!', user, token });
      }
    });
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
    // login and return the information including token as JSON
    return res.redirect(`${env.appUrl}/oauth?token=${token}`);
    // @TODO complete to process, send back the token by requesting API with front to verify user
  })(req, res, next);
};

export { signup, signin, socialAuth, socialAuthCallback };
