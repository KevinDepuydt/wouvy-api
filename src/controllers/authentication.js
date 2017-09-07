import jwt from 'jsonwebtoken';
import env from '../config/env';
import User from '../models/user';

/**
 * Subscribe an User
 */
const subscribe = (req, res) => {
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
const login = (req, res) => {
  // find the user
  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }

    if (!user || !user.authenticate(req.body.password)) {
      res.status(400).send({ message: 'Authentication failed. Bad credentials.' });
    } else {
      // if user is found and password is ok
      // delete user password for security
      user.password = undefined;
      // create a token to authenticate user api call
      const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
      // return the information including token as JSON
      res.jsonp({ message: 'Login successful!', user, token });
    }
  });
};

export { subscribe, login };
