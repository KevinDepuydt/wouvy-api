import isMongoId from 'validator/lib/isMongoId';
import _ from 'lodash';
import Task from '../models/task';
import NewsFeedItem from '../models/news-feed-item';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Task
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const io = req.io;
  const task = new Task({ workflow, user, ...req.body });

  task.save()
    .then((saved) => {
      saved
        .populate({ path: 'users', select: 'email firstname lastname username picture avatar' })
        .populate({ path: 'user', select: 'username picture avatar' }, (err, populated) => {
          res.jsonp(populated);
          // Post the task
          if (!populated.private) {
            io.to(`w/${workflow._id}/tasks`).emit('task-created', populated);
            const item = new NewsFeedItem({ user, workflow, type: 'task', data: { task: populated } });
            item.save().then(() => {
              io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-created', item);
            });
          }
        });
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Show the current Task
 */
const read = (req, res) => {
  const task = req.task ? req.task.toJSON() : {};

  // extra field can be added here
  res.jsonp(task);
};

/**
 * Update a Task
 */
const update = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  let task = req.task;

  task = _.extend(task, req.body);

  task.save()
    .then(() => {
      Task.findById(task._id)
        .populate({ path: 'users', select: 'email firstname lastname username picture avatar' })
        .populate({ path: 'subTasks.users', select: 'email firstname lastname username picture avatar' })
        .populate({ path: 'user', select: 'username picture avatar' })
        .exec()
        .then((taskFound) => {
          res.jsonp(taskFound);
          if (!taskFound.private) {
            io.to(`w/${workflow._id}/tasks`).emit('task-updated', taskFound);
          } else {
            io.to(`w/${workflow._id}/notes/${req.user._id}`).emit('task-updated', taskFound);
          }
        })
        .catch(err => res.status(500).send(errorHandler(err)));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Update many tasks
 */
const updateMany = async (req, res) => {
  const reorderedTasks = req.body.tasks.map((t, i) => ({ ...t, order: i + 1 }));

  for (const task of reorderedTasks) {
    await Task.findOneAndUpdate({ _id: task._id }, task);
  }

  res.jsonp(reorderedTasks);
};

/**
 * Remove a Task
 */
const remove = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const task = req.task;

  task.remove()
    .then((removedTask) => {
      res.jsonp(removedTask);
      if (!removedTask.private) {
        io.to(`w/${workflow._id}/tasks`).emit('task-deleted', removedTask);
        io.to(`w/${workflow._id}/tasks/${removedTask._id}`).emit('task-item-deleted', removedTask);
        NewsFeedItem.findOneAndRemove({ 'data.task': removedTask._id })
          .then((removedItem) => {
            io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', removedItem);
          })
          .catch(err => res.status(500).send({ message: err }));
      }
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Task
 */
const list = (req, res) => {
  // default criteria for general tasks
  const criteria = { workflow: req.workflow._id, private: false };

  // handle private tasks
  if (req.query.private && req.query.private === 'true') {
    criteria.user = req.user._id;
    criteria.private = true;
  }

  Task.find(criteria)
    .sort('order -created')
    .populate({ path: 'users', populate: { path: 'user', select: 'email firstname lastname username picture avatar' } })
    .populate({ path: 'subTasks.users', select: 'email firstname lastname username picture avatar' })
    .populate({ path: 'user', select: 'username picture avatar' })
    .then(tasks => res.jsonp(tasks))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Task middleware
 */
const taskByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Task id is not valid',
    });
  }

  Task.findById(id)
    .populate({ path: 'users', populate: { path: 'user', select: 'email firstname lastname username picture avatar' } })
    .populate({ path: 'subTasks.users', select: 'email firstname lastname username picture avatar' })
    .populate({ path: 'user', select: 'username picture avatar' })
    .exec()
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: 'Task not found',
        });
      }
      req.task = task;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, updateMany, remove, list, taskByID };
