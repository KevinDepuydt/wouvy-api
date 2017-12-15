import mongoose from 'mongoose';
import _ from 'lodash';
import Thread from '../models/thread';

/**
 * Create a Thread
 */
const create = (req, res) => {
  const thread = new Thread(req.body);

  /*
  if (thread.users.indexOf(req.user) === -1) {
    thread.users.push(req.user);
  }
  */

  thread.save()
    .then(savedThread => res.jsonp(savedThread))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Thread
 */
const read = (req, res) => {
  const thread = req.thread ? req.thread.toJSON() : {};

  // extra field can be added here
  res.jsonp(thread);
};

/**
 * Update a Thread
 */
const update = (req, res) => {
  let thread = req.thread;

  thread = _.extend(thread, req.body);

  // if message then push to messages
  if (req.body.message) {
    thread.messages.push(req.body.message);
  }

  thread.save()
    .then(savedThread => res.jsonp(savedThread))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Thread
 */
const remove = (req, res) => {
  const thread = req.thread;

  thread.remove()
    .then(removedThread => res.jsonp(removedThread))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Thread
 */
const list = (req, res) => {
  // @TODO add where user id = req.user.id in find
  Thread.find().sort('-created').exec()
    .then(documents => res.jsonp(documents))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Thread middleware
 */
const threadByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Thread id is not valid',
    });
  }

  Thread.findById(id)
    .then((thread) => {
      if (!thread) {
        return res.status(404).send({
          message: 'Thread not found',
        });
      }
      req.thread = thread;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, threadByID };
