import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Member from '../models/member';
import Thread from '../models/thread';
import Workflow from '../models/workflow';
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
      const member = new Member({ user, workflow });
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
      const members = results.filter(r => r.success === true).map(r => r.member);
      const ids = members.map(m => m.user._id);
      // add members to workflow
      Workflow.findByIdAndUpdate(workflow._id, { $push: { members: { $each: members } } })
        .then((updated) => {
          console.log('Updated workflow after new members push', updated);
        }).catch((err) => {
          console.log('Error adding members to workflow', err);
        });
      // add members to defaults threads
      Thread.findOneAndUpdate(
        { workflow: workflow._id, isDefault: true },
        { $push: { users: { $each: ids } } },
      ).then((updated) => {
        console.log('Updated thread after new users push', updated);
      }).catch((err) => {
        console.log('Error adding users to default thread', err);
      });
      // Finally return new members + errors
      res.jsonp({ members, errors });
    });
  } else { // one member
    const member = new Member({ user: req.body.user, workflow });
    member.save()
      .then((saved) => {
        saved.populate({ path: 'user', select: '-password -resetToken' }, (err, populated) => {
          // add member to workflow
          Workflow.findByIdAndUpdate(workflow._id, { $push: { members: member } })
            .then((updated) => {
              console.log('Updated workflow after new members push', updated);
            })
            .catch((errWf) => {
              console.log('Error adding members to workflow', errWf);
            });
          // add member to defaults threads
          Thread.findOneAndUpdate(
            { workflow: workflow._id, isDefault: true },
            { $push: { users: populated.user._id } },
          ).then((updated) => {
            console.log('Updated thread after new users push', updated);
          }).catch((errThread) => {
            console.log('Error adding users to default thread', errThread);
          });
          // Finally return new member + error
          res.jsonp({ member, errors: [] });
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
  Member.find({ workflow: req.workflow._id })
    .populate('user', 'email lastname firstname username picture')
    .sort('-created')
    .exec()
    .then(members => res.jsonp(members))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Member middleware
 */
const memberByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
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
