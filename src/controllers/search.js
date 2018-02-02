import User from '../models/user';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Document
 */
const searchUsers = (req, res) => {
  const query = req.body.query || '';

  User.find({ $text: { $search: query } }, 'email')
    .sort('-created')
    .exec()
    .then(users => res.jsonp(users))
    .catch(err => res.status(500).send(errorHandler(err)));
};

export { searchUsers };
