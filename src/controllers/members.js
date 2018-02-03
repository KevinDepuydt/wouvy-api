import mongoose from 'mongoose';
import _ from 'lodash';
import Member from '../models/member';
import { prepareWorkflow } from '../helpers/workflows';
import { prepareMember } from '../helpers/members';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Member
 */
const create = (req, res) => {
  const workflow = req.workflow;

  if (req.body.users) { // many members
    const membersPromises = req.body.users.map(user => new Promise((resolve) => {
      const member = new Member({ user, workflowId: workflow._id });
      member.save()
        .then((saved) => {
          saved.populate({ path: 'user', select: '-password -resetToken' }, (err, populated) => {
            resolve({ success: true, member: populated });
          });
        })
        .catch(err => resolve({ success: false, error: errorHandler(err) }));
    }));
    Promise.all(membersPromises).then((results) => {
      const errors = results.filter(r => r.success === false).map(r => r.error);
      const newMembers = results.filter(r => r.success === true).map(r => r.member);
      // then add members to workflow
      workflow.members = workflow.members.concat(newMembers);
      workflow.save()
        .then((savedWorkflow) => {
          res.jsonp({ workflow: prepareWorkflow(savedWorkflow, req.user), errors });
        })
        .catch(err => res.status(500).send({ message: err }));
    });
  } else { // one member
    const member = new Member({ user: req.body.user, workflowId: workflow._id });
    member.save()
      .then((saved) => {
        saved.populate({ path: 'user', select: '-password -resetToken' }, (err, populated) => {
          workflow.members.push(populated);
          workflow.save()
            .then((savedWorkflow) => {
              res.jsonp({
                workflow: prepareWorkflow(savedWorkflow, req.user),
                errors: [],
              });
            })
            .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
        });
      })
      .catch(err => res.status(500).send({ message: err }));
  }
};

/**
 * Show the current Member
 */
const read = (req, res) => {
  res.jsonp(prepareMember(req.member));
};

/**
 * Update a Member
 */
const update = (req, res) => {
  let member = req.member;

  member = _.extend(member, req.body);

  member.save()
    .then(savedMember => res.jsonp(prepareMember(savedMember)))
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
        .then(() => res.jsonp(prepareWorkflow(savedWorkflow, req.user)))
        .catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Member
 */
const list = (req, res) => {
  const workflow = req.workflow;

  Member.find({ workflowId: workflow._id })
    .sort('-created')
    .exec()
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
    .populate('user', 'email lastname firstname username picture')
    .exec()
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
