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

    if (!user) {
      res.status(400).send({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== req.body.password) {
        res.status(400).send({ message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        const token = jwt.sign(user, env.jwtSecret, { expiresIn: '24h' });
        // return the information including token as JSON
        res.jsonp({ message: 'Login successful!', user, token });
      }
    }
  });
};

export { subscribe, login };
