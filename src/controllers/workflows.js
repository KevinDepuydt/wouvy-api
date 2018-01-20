import crypto from 'crypto';
import mongoose from 'mongoose';
import _ from 'lodash';
import slug from 'slug';
import Workflow from '../models/workflow';
import User from '../models/user';
import Member from '../models/member';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Workflow
 */
const create = (req, res) => {
  const workflow = new Workflow(req.body);

  workflow.user = req.user;

  if (!workflow.slug.length) {
    workflow.slug = slug(workflow.name);
  }

  workflow.save()
    .then(savedWorkflow => res.jsonp(savedWorkflow))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Show the current Workflow
 */
const read = (req, res) => {
  const workflow = req.workflow ? req.workflow.toJSON() : {};

  // custom data that isn't persisted to mongodb
  if (req.user && workflow.user) {
    workflow.isCurrentUserOwner = workflow.user._id.toString() === req.user._id.toString();
    // workflow.isCurrentUserAdmin = workflow.isCurrentUserOwner || req.user.roles.indexOf('admin') !== -1;
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
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Remove an Workflow
 */
const remove = (req, res) => {
  const workflow = req.workflow;

  workflow.remove()
    .then(removedWorkflow => res.jsonp(removedWorkflow))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * List of Workflows
 */
const list = (req, res) => {
  Member.find({ user: req.user }, 'workflowId')
    .then((members) => {
      const or = [{ user: req.user }];
      if (members.length) {
        const membersIds = members.map(m => m._id);
        or.push({ members: { $in: [membersIds] } });
      }
      Workflow.find({ $or: or }, '-password')
        .sort('-created')
        .deepPopulate('user members members.user')
        .exec()
        .then(workflows => res.jsonp(workflows))
        .catch(err => res.status(500).send(errorHandler(err)));
    }).catch(err => res.status(500).send(errorHandler(err)));
};

const filterWorkflowsForUser = (w, user) =>
  w.user._id.toString() === user._id.toString() ||
  w.members.findIndex(m => m.user._id.toString() === user._id.toString()) !== -1;
const listTest = (req, res) => {
  Workflow.find({}, '-password')
    .sort('-created')
    .deepPopulate('user members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows.filter(w => filterWorkflowsForUser(w, req.user))))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Search workflows
 */
const search = (req, res) => {
  Workflow.find({ $text: { $search: req.query.terms } })
    .sort('-created')
    .populate('user', 'displayName email')
    .deepPopulate('members members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * List possible user for adding new members
 */
const listPossibleMembers = (req, res) => {
  const workflow = req.workflow;
  const ids = workflow.members.map(m => m.user._id);

  User.find({ $and: [{ _id: { $nin: ids } }, { _id: { $ne: workflow.user._id } }] })
    .then(users => res.jsonp(users))
    .catch(err => res.status(500).send(errorHandler(err)));
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
    .catch(err => res.status(500).send(errorHandler(err)));
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
    .catch(err => res.status(500).send(errorHandler(err)));
};

const authenticateUser = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;

  if (workflow.authenticate(req.body.password)) {
    const member = new Member({ user, workflowId: workflow._id });
    member.save()
      .then((savedMember) => {
        console.log('saved', savedMember);
        workflow.members.push(member);
        workflow.save()
          .then(savedWorkflow => res.jsonp({
            message: `Tu es maintenant membre du workflow ${savedWorkflow.name}`,
            workflow: savedWorkflow,
          }))
          .catch(err => res.status(500).send(errorHandler(err)));
      })
      .catch(err => res.status(500).send(errorHandler(err)));
  } else {
    res.status(403).jsonp({ message: 'Wrong password' });
  }
  console.log();
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
  search,
  listPossibleMembers,
  getByToken,
  generateAccessToken,
  authenticateUser,
  workflowByID,
  workflowByIdOrSlug,
};
