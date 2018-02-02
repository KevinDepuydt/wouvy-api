import mongoose from 'mongoose';
import _ from 'lodash';
import Member from '../models/member';
import env from '../config/env';
import { prepareForClient } from '../helpers/workflows';

const rights = env.rights;

/**
 * Create a Member
 */
const create = (req, res) => {
  const member = new Member(req.body);

  member.save()
    .then(savedDoc => res.jsonp(savedDoc))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Member
 */
const read = (req, res) => {
  const member = req.member ? req.member.toJSON() : {};

  // is member moderator of the workflows
  member.isModerator = member.rights.workflows === rights.MODERATE.value;

  res.jsonp(member);
};

/**
 * Update a Member
 */
const update = (req, res) => {
  let member = req.member;

  const memberRights = _.assign({}, member.rights);

  member = _.extend(member, req.body);

  if (req.body.rights) {
    member.rights = _.extend(memberRights, req.body.rights);
  }

  member.save()
    .then(savedDoc => res.jsonp(savedDoc))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove an Member
 */
const remove = (req, res) => {
  const workflow = req.workflow;
  const member = req.member;

  // remove member from workflow
  workflow.members = _.filter(workflow.members, m => m._id.toString() !== member._id.toString());

  workflow.save()
    .then((savedWorkflow) => {
      member.remove()
        .then(() => res.jsonp(prepareForClient(savedWorkflow, req.user)))
        .catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Member
 */
const list = (req, res) => {
  Member.find().sort('-created').exec()
    .then(members => res.jsonp(members))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Member middleware
 */
const memberByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Member id is not valid',
    });
  }

  Member.findById(id)
    .then((member) => {
      if (!member) {
        return res.status(404).send({
          message: 'Member not found',
        });
      }
      req.member = member;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, memberByID };
