import crypto from 'crypto';
import mongoose from 'mongoose';
import _ from 'lodash';
import slug from 'slug';
import Workflow from '../models/workflow';
import User from '../models/user';

/**
 * Create a Workflow
 */
const create = (req, res) => {
  const workflow = new Workflow(req.body);

  if (!workflow.user) {
    workflow.user = req.user;
  }

  if (!workflow.slug.length) {
    workflow.slug = slug(workflow.name);
  }

  workflow.save()
    .then(savedWorkflow => res.jsonp(savedWorkflow))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current Workflow
 */
const read = (req, res) => {
  const workflow = req.workflow ? req.workflow.toJSON() : {};

  // custom data that isn't persisted to mongodb
  if (req.user && workflow.user) {
    workflow.isCurrentUserOwner = workflow.user._id.toString() === req.user._id.toString();
    workflow.isCurrentUserAdmin = workflow.isCurrentUserOwner || req.user.roles.indexOf('admin') !== -1;
  }

  res.jsonp(workflow);
};

/**
 * Update a Workflow
 */
const update = (req, res) => {
  let workflow = req.workflow;

  const workflowEnabledFeatures = _.assign({}, workflow.enabledFeatures);

  workflow = _.extend(workflow, req.body);

  if (req.body.enabledFeatures) {
    workflow.enabledFeatures = _.extend(workflowEnabledFeatures, req.body.enabledFeatures);
  }

  workflow.save()
    .then(savedWorkflow => res.jsonp(savedWorkflow))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove an Workflow
 */
const remove = (req, res) => {
  const workflow = req.workflow;

  workflow.remove()
    .then(removedWorkflow => res.jsonp(removedWorkflow))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Workflows
 */
const list = (req, res) => {
  Workflow.find()
    .sort('-created')
    .populate('user', 'displayName email')
    .deepPopulate('members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Workflows
 */
const listForUser = (req, res) => {
  // @TODO add condition to get only user workflows (where user is member of the workflow)
  Workflow.find()
    .sort('-created')
    .populate('user', 'displayName email')
    .deepPopulate('members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Search workflows
 */
const search = (req, res) => {
  Workflow.find({ $text: { $search: req.query.terms }, public: true })
    .sort('-created')
    .populate('user', 'displayName email')
    .deepPopulate('members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List possible user for adding new members
 */
const listPossibleMembers = (req, res) => {
  const workflow = req.workflow;
  const ids = workflow.members.map(m => m.user._id);

  User.find({ $and: [{ _id: { $nin: ids } }, { _id: { $ne: workflow.user._id } }] })
    .then(users => res.jsonp(users))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Get workflow by token
 */
const getByToken = (req, res) => {
  Workflow.findOne({ accessToken: req.query.accessToken })
    .select('user._id members slug')
    .deepPopulate('members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Generate access token
 */
const generateAccessToken = (req, res) => {
  const buffer = crypto.randomBytes(20);
  const token = buffer.toString('hex');
  const workflow = req.workflow;

  // Add token to workflow
  workflow.accessToken = token;

  // Then save workflow
  workflow.save()
    .then(() => res.jsonp(token))
    .catch(err => res.status(400).send({ message: err }));
};


/**
 * Workflow middleware
 */
const workflowByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Workflow id is not valid',
    });
  }

  Workflow
    .findById(id)
    .populate('user', 'displayName')
    .deepPopulate('documents questions questions.user news sponsors photos votes votes.answers tagClouds members members.user')
    .exec()
    .then((workflow) => {
      if (!workflow) {
        return res.status(404).send({
          message: 'Workflow not found',
        });
      }
      req.workflow = workflow;
      next();
    })
    .catch(err => next(err));
};

/**
 * Workflow middleware to find by Id OR Slug
 */
const workflowByIdOrSlug = (req, res, next, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    Workflow
      .findById(id)
      .populate('user', 'displayName')
      .deepPopulate('documents questions questions.user news sponsors photos votes votes.answers tagClouds members members.user')
      .exec()
      .then((workflow) => {
        if (!workflow) {
          return res.status(404).send({
            message: 'Workflow not found',
          });
        }
        req.workflow = workflow;
        next();
      })
      .catch(err => next(err));
  } else {
    Workflow
      .findOne({ slug: id })
      .populate('user', 'displayName email profileImageURL')
      .deepPopulate('documents questions questions.user news sponsors photos votes votes.answers tagClouds members members.user')
      .exec()
      .then((workflow) => {
        if (!workflow) {
          return res.status(404).send({
            message: 'Workflow not found',
          });
        }
        req.workflow = workflow;
        next();
      })
      .catch(err => next(err));
  }
};

export {
  create,
  read,
  update,
  remove,
  list,
  listForUser,
  search,
  listPossibleMembers,
  getByToken,
  generateAccessToken,
  workflowByID,
  workflowByIdOrSlug,
};
