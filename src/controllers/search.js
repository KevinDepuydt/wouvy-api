import isEmail from 'validator/lib/isEmail';
import User from '../models/user';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Document
 */
const searchUsers = (req, res) => {
  const workflow = req.workflow;
  const query = req.body.query || '';

  // build list of users that are already part of workflow
  const notInIds = [workflow.user._id].concat(workflow.members.map(m => m.user._id));

  User.find({ $text: { $search: query }, _id: { $nin: notInIds } }, 'email picture')
    .then(users => res.jsonp(users))
    .catch(err => res.status(500).send(errorHandler(err)));
};

const searchUserByEmail = (req, res) => {
  const workflow = req.workflow;
  const email = req.body.email;

  if (!isEmail(email)) {
    return res.jsonp([]);
  }

  // build list of users that are already part of workflow
  const notInIds = [workflow.user._id].concat(workflow.members.map(m => m.user._id));

  User.findOne({ email, _id: { $nin: notInIds } }, 'email picture')
    .then(user => res.jsonp(user))
    .catch(err => res.status(500).send(errorHandler(err)));
};

export { searchUsers, searchUserByEmail };
