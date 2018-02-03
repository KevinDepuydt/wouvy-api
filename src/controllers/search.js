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

  console.log('nin ids', notInIds);

  User.find({ $text: { $search: query }, _id: { $nin: notInIds } }, 'email')
    .sort('-created')
    .exec()
    .then(users => res.jsonp(users))
    .catch(err => res.status(500).send(errorHandler(err)));
};

export { searchUsers };
