import isMongoId from 'validator/lib/isMongoId';
import _ from 'lodash';
import Thread from '../models/thread';
import Message from '../models/message';
import { prepareWorkflow } from '../helpers/workflows';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Thread
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const thread = new Thread({ user, ...req.body });

  thread.save()
    .then((saved) => {
      saved
        .populate({ path: 'owner', select: '-password -resetToken' })
        .populate({ path: 'users', select: '-password -resetToken' }, (err, populated) => {
          workflow.threads.push(populated);
          workflow.save()
            .then((savedWorkflow) => {
              res.jsonp({
                workflow: prepareWorkflow(savedWorkflow, req.user),
                thread,
              });
            })
            .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
        });
    })
    .catch(err => res.status(500).send(errorHandler(err)));
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

  if (thread.isDefault) {
    return res.status(400).send({ message: 'Vous ne pouvez pas supprimer le thread général d\'un workflow' });
  }

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
 * Add message to thread
 */
const addMessage = (req, res) => {
  const user = req.user;
  const thread = req.thread;
  const io = req.io;
  const message = new Message({ user, ...req.body });

  message.save()
    .then((saved) => {
      thread.messages.push(message);
      thread.save();
      saved.populate({ path: 'user', select: '-password -resetToken' }, (err, populated) => {
        res.jsonp(populated);
        io.to(`thread/${thread._id}`).emit('thread message', populated);
      });
    })
    .catch(errMessage => res.status(500).send({ message: errMessage }));
};

/**
 * Thread middleware
 */
const threadByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Thread id is not valid',
    });
  }

  Thread
    .findById(id)
    .deepPopulate('owner users messages messages.user')
    .exec()
    .then((thread) => {
      if (!thread) {
        return res.status(404).send({ message: 'Thread not found' });
      }
      req.thread = thread;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, addMessage, threadByID };
