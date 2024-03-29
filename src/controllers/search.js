import isEmail from 'validator/lib/isEmail';
import User from '../models/user';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Document
 */
const searchUsers = (req, res) => {
  const { workflow } = req;
  const query = req.body.query || '';

  // build list of users that are already part of workflow
  const notInIds = [workflow.user._id].concat(workflow.users.map(user => user._id));

  User.find({ $text: { $search: query }, _id: { $nin: notInIds } }, 'email picture avatar firstname lastname username')
    .then(users => res.json(users))
    .catch(err => res.status(500).send(errorHandler(err)));
};

const searchUserByEmail = (req, res) => {
  const { workflow, body } = req;
  const { email } = body;

  if (!isEmail(email)) {
    return res.json([]);
  }

  // build list of users that are already part of workflow
  const notInIds = [workflow.user._id].concat(workflow.users.map(user => user._id));

  User.findOne({ email, _id: { $nin: notInIds } }, 'email picture avatar firstname lastname username')
    .then(user => res.json(user))
    .catch(err => res.status(500).send(errorHandler(err)));
};

export { searchUsers, searchUserByEmail };
