import mongoose from 'mongoose';
import _ from 'lodash';
import Task from '../models/task';

/**
 * Create a Task
 */
const create = (req, res) => {
  const task = new Task(req.body);

  task.save()
    .then(savedTask => res.jsonp(savedTask))
    .catch(err => res.status(500).send({ message: err }));
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
  let task = req.task;

  task = _.extend(task, req.body);

  task.save()
    .then(savedTask => res.jsonp(savedTask))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Task
 */
const remove = (req, res) => {
  const task = req.task;

  task.remove()
    .then(removedTask => res.jsonp(removedTask))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Task
 */
const list = (req, res) => {
  Task.find().sort('-created').exec()
    .then(tasks => res.jsonp(tasks))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Task middleware
 */
const taskByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task id is not valid',
    });
  }

  Task.findById(id)
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
