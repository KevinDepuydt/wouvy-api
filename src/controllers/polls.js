import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Poll from '../models/poll';
import NewsFeedItem from '../models/news-feed-item';

/**
 * Create a Poll
 */
const create = (req, res) => {
  const { io, user, workflow } = req;
  const poll = new Poll({ workflow, user, ...req.body });

  poll.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.json(populated);
        io.to(`w/${workflow._id}/polls`).emit('poll-created', populated);
        // NewsFeedItem of the task
        const item = new NewsFeedItem({ user, workflow, type: 'poll', data: { poll } });
        item.save().then((savedItem) => {
          savedItem.populate({ path: 'user', select: 'email firstname lastname email username' }, (errItem, populatedItem) => {
            if (!errItem) {
              io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-created', populatedItem);
            }
          });
        });
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Poll
 */
const read = (req, res) => {
  const poll = req.poll ? req.poll.toJSON() : {};

  // extra field can be added here
  res.json(poll);
};

/**
 * Update a Poll
 */
const update = (req, res) => {
  const { io, workflow } = req;
  let { poll } = req;

  poll = _.extend(poll, req.body);

  poll.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.json(populated);
        io.to(`w/${workflow._id}/polls`).emit('poll-updated', populated);
        NewsFeedItem
          .findOne({ 'data.poll': populated })
          .populate('data.poll')
          .populate({ path: 'user', select: 'email firstname lastname email username' })
          .exec()
          .then((newsFeedItem) => {
            if (newsFeedItem._id) {
              io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-updated', newsFeedItem);
            }
          });
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Poll
 */
const remove = (req, res) => {
  const { io, workflow, poll } = req;

  poll.remove()
    .then((removed) => {
      res.json(removed);
      io.to(`w/${workflow._id}/polls`).emit('poll-deleted', removed);
      NewsFeedItem.findOneAndRemove({ 'data.poll': removed._id })
        .then((removedItem) => {
          console.log('Associated item', removedItem);
          io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', removedItem);
        })
        .catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Polls
 */
const list = (req, res) => {
  Poll.find({ workflow: req.workflow._id })
    .sort('-created')
    .exec()
    .then(polls => res.json(polls))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Poll middleware
 */
const pollByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Poll id is not invalid',
    });
  }

  Poll.findById(id)
    .populate('choices')
    .then((poll) => {
      if (!poll) {
        return res.status(404).send({
          message: 'Poll not found',
        });
      }
      req.poll = poll;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, pollByID };
