import mongoose from 'mongoose';
import _ from 'lodash';
import User from '../models/user';

/**
 * Create an User as an admin
 */
const create = (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(savedUser => res.jsonp(savedUser))
    .catch(err => res.status(400).send({ message: err }));
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

  user.save()
    .then(savedUser => res.jsonp(savedUser))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove an User
 */
const remove = (req, res) => {
  const user = req.user;

  user.remove()
    .then(removedUser => res.jsonp(removedUser))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Users
 */
const list = (req, res) => {
  User.find().sort('-created').exec()
    .then(users => res.jsonp(users))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * User middleware
 */
const userByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User id is not valid',
    });
  }

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }
      req.user = user;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, userByID };
