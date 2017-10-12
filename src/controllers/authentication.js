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
      return res.status(400).send({
        message: err,
      });
    }

    res.jsonp(user);
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
        res.status(400).send(loginErr);
      } else {
        res.json({ message: 'Login successful!', user, token });
      }
    });
  })(req, res, next);
};

export { signup, signin };
