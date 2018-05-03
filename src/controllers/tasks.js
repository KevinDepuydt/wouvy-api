import isMongoId from 'validator/lib/isMongoId';
import _ from 'lodash';
import Task from '../models/task';
import { prepareWorkflow } from '../helpers/workflows';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Task
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const task = new Task({ owner: user, ...req.body });

  task.save()
    .then((saved) => {
      saved.populate({ path: 'owner', select: 'username picture' }, (err, populated) => {
        workflow.tasks.push(populated);
        workflow.save()
          .then((savedWorkflow) => {
            res.jsonp({
              workflow: prepareWorkflow(savedWorkflow, req.user),
              task: populated,
            });
          })
          .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
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
  if (!isMongoId(id)) {
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
