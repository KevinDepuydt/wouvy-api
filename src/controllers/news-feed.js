import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import NewsFeedItem from '../models/news-feed-item';

/**
 * Create a NewsFeedItem
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const io = req.io;
  const item = new NewsFeedItem(req.body);

  item.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current NewsFeedItem
 */
const read = (req, res) => {
  const item = req.newsFeedItem ? req.newsFeedItem.toJSON() : {};

  // extra field can be added here
  res.jsonp(item);
};

/**
 * Update a NewsFeedItem
 */
const update = (req, res) => {
  let item = req.newsFeedItem;

  item = _.extend(item, req.body);

  item.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove an NewsFeedItem
 */
const remove = (req, res) => {
  const item = req.newsFeedItem;

  item.remove()
    .then(removed => res.jsonp(removed))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of NewsFeedItem
 */
const list = (req, res) => {
  const workflow = req.workflow;
  NewsFeedItem.find({ workflow })
    .sort('-created')
    .deepPopulate('user data.task data.task.owner data.post data.post.user data.document')
    .exec()
    .then(items => res.jsonp(items))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * NewsFeedItem middleware
 */
const newsFeedItemByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'NewsFeedItem id is not invalid',
    });
  }

  NewsFeedItem.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: 'NewsFeedItem not found',
        });
      }
      req.newsFeedItem = item;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, newsFeedItemByID };
