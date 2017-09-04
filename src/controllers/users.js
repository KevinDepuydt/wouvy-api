import mongoose from 'mongoose';
import _ from 'lodash';
import User from '../models/user';

/**
 * Create an User
 */
const create = (req, res) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      res.jsonp(user);
    }
  });
};

/**
 * Show the current User
 */
const read = (req, res) => {
  // convert mongoose document to JSON
  const user = req.user ? req.user.toJSON() : {};

  // extra field can be added here

  res.jsonp(user);
};

/**
 * Update an User
 */
const update = (req, res) => {
  let user = req.user;

  user = _.extend(user, req.body);

  user.save((err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      res.jsonp(user);
    }
  });
};

/**
 * Remove an User
 */
const remove = (req, res) => {
  const user = req.user;

  user.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      res.jsonp(user);
    }
  });
};

/**
 * List of Users
 */
const list = (req, res) => {
  User.find().sort('-created').exec((err, users) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      res.jsonp(users);
    }
  });
};

/**
 * User middleware
 */
const userByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User id is invalid'
    });
  }

  User.findById(id, (err, user) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.status(404).send({
        message: 'No User with that identifier has been found'
      });
    }
    req.user = user;
    next();
  });
};

export { create, read, update, remove, list, userByID };
