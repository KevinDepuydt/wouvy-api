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
        .populate({ path: 'members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
        .populate({ path: 'user', select: 'username picture' }, (err, populated) => {
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
        .populate({ path: 'members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
        .populate({ path: 'subTasks.members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
        .populate({ path: 'user', select: 'username picture' })
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
            console.log('Remove item associated to task');
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
  if (req.query.private && req.query.private === 'true' && req.user) {
    console.log('GET Private tasks');
    Task.find({ workflow: req.workflow._id, user: req.user._id, private: true })
      .sort('-created')
      .populate({ path: 'members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
      .populate({ path: 'subTasks.members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
      .populate({ path: 'user', select: 'username picture' })
      .exec()
      .then(tasks => res.jsonp(tasks))
      .catch(err => res.status(500).send({ message: err }));
  } else {
    console.log('GET General tasks');
    const criteria = { workflow: req.workflow._id, private: false };
    if (req.query.select && ['done', 'not_done'].indexOf(req.query.select) !== -1) {
      if (req.query.select === 'done') {
        criteria.done = true;
      } else if (req.query.select === 'not_done') {
        criteria.done = false;
      }
    }
    if (req.query.member && isMongoId(req.query.member)) {
      criteria.$or = [
        { members: { $in: [req.query.member] } },
        { 'subTasks.members': { $in: [req.query.member] } },
      ];
    }
    console.log('List task criteria', criteria);
    Task.find(criteria)
      .sort('-created')
      .populate({ path: 'members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
      .populate({ path: 'subTasks.members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
      .populate({ path: 'user', select: 'username picture' })
      .then(tasks => res.jsonp(tasks))
      .catch(err => res.status(500).send({ message: err }));
  }
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
    .populate({ path: 'members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
    .populate({ path: 'subTasks.members', populate: { path: 'user', select: 'email firstname lastname username picture' } })
    .populate({ path: 'user', select: 'username picture' })
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

export { create, read, update, remove, list, taskByID };
