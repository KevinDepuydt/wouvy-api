import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Poll from '../models/poll';
import NewsFeedItem from '../models/news-feed-item';
import { prepareWorkflow } from '../helpers/workflows';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Poll
 */
const create = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const io = req.io;
  const poll = new Poll({
    user,
    topic: req.body.topic,
    choices: req.body.choices, // .map(c => new PollChoice(c)),
  });

  poll.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        workflow.polls.push(populated);
        workflow.save()
          .then((savedWorkflow) => {
            res.jsonp({
              workflow: prepareWorkflow(savedWorkflow, user),
              poll: populated,
            });
            io.to(`w/${workflow._id}/polls`).emit('poll-created', populated);
          })
          .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
        // NewsFeedItem of the task
        const item = new NewsFeedItem({ user, workflow: workflow._id, type: 'poll', data: { poll } });
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
  res.jsonp(poll);
};

/**
 * Update a Poll
 */
const update = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  let poll = req.poll;

  poll = _.extend(poll, req.body);

  poll.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.jsonp(populated);
        io.to(`w/${workflow._id}/polls`).emit('poll-updated', populated);
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Poll
 */
const remove = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const poll = req.poll;

  poll.remove()
    .then((removed) => {
      res.jsonp(removed);
      io.to(`w/${workflow._id}/polls`).emit('poll-deleted', removed);
      workflow.polls.splice(workflow.polls.findIndex(p => p._id === poll._id), 1);
      workflow.save();
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Polls
 */
const list = (req, res) => {
  Poll.find()
    .sort('-created')
    .exec()
    .then(polls => res.jsonp(polls))
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
