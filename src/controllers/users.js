import isMongoId from 'validator/lib/isMongoId';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import env from '../config/env';
import User from '../models/user';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create an User as an admin
 */
const create = (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current User
 */
const read = (req, res) => {
  const user = req.user ? req.user.toJSON() : {};

  // extra field can be added here
  res.json(user);
};

/**
 * Update an User
 */
const update = (req, res) => {
  let { user } = req;

  user = _.extend(user, req.body);

  user.save()
    .then((savedUser) => {
      // delete user password for security
      savedUser.password = undefined;
      // create a token to authenticate user api call
      const token = jwt.sign(
        Object.assign({}, savedUser),
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn },
      );
      // returned updated token
      res.json({ message: 'Votre profil à été mis à jour !', token });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Update an User password
 */
const updatePassword = (req, res) => {
  const { user } = req;
  const { password, confirmation } = req.body;

  if (password === confirmation) {
    user.password = password;
    user.save()
      .then((savedUser) => {
        // delete user password for security
        savedUser.password = undefined;
        // create a token to authenticate user api call
        const token = jwt.sign(
          Object.assign({}, savedUser),
          env.jwtSecret,
          { expiresIn: env.jwtExpiresIn },
        );
        // returned updated token
        res.json({ message: 'Vos identifiants ont été mis à jour.', token });
      })
      .catch(err => res.status(500).send({ message: err }));
  } else {
    res.status(401).send({ message: 'Les mots de passe ne correspondent pas.' });
  }
};

/**
 * Remove an User
 */
const remove = (req, res) => {
  const { user } = req;

  user.remove()
    .then(removedUser => res.json(removedUser))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Users
 */
const list = (req, res) => {
  User.find().sort('-created').exec()
    .then(users => res.json(users))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Validate user
 */
const validate = (req, res) => {
  const { user } = req;
  if (!req.user || !req.user._id) {
    res.status(400).send({ message: 'User not valid' });
  } else {
    User.findById(user._id).then((found) => {
      found.password = undefined;
      const token = jwt.sign(
        Object.assign({}, found),
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn },
      );
      res.json({ token });
    }).catch(err => res.status(400).send({ message: errorHandler(err) }));
  }
};

/**
 * User middleware
 */
const userByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(401).send({
      message: 'User id is not valid',
    });
  }

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'Utilisateur introuvable.',
        });
      }
      req.user = user;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, updatePassword, remove, list, validate, userByID };
