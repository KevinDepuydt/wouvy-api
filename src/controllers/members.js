import _ from 'lodash';
import Thread from '../models/thread';
import Workflow from '../models/workflow';
import { prepareWorkflow } from '../helpers/workflows';
import { prepareMember } from '../helpers/members';
import env from '../config/env';

/**
 * Create a Member
 */
const create = (req, res) => {
  const workflow = req.workflow;

  if (req.body.users) { // many members
    // add members to workflow
    const roles = req.body.users.map(user => ({ user, role: env.userRoles.member }));
    Workflow.findByIdAndUpdate(
      workflow._id,
      {
        $push: {
          users: { $each: req.body.users },
          roles: { $each: roles },
        },
      },
    ).then((updated) => {
      console.log('Updated workflow after new members push', updated);
    }).catch((err) => {
      console.log('Error adding members to workflow', err);
    });
    // add members to defaults threads
    Thread.findOneAndUpdate(
      { workflow: workflow._id, isDefault: true },
      { $push: { users: { $each: req.body.users } } },
    ).then((updated) => {
      console.log('Updated thread after new users push', updated);
    }).catch((err) => {
      console.log('Error adding users to default thread', err);
    });
    // Finally return new members + errors
    res.json({ users: req.body.users });
  } else { // one member
    // add member to workflow
    Workflow.findByIdAndUpdate(workflow._id, { $push: { users: req.body.user } })
      .then((updated) => {
        console.log('Updated workflow after new members push', updated);
      })
      .catch((errWf) => {
        console.log('Error adding members to workflow', errWf);
      });
    // add member to defaults threads
    Thread.findOneAndUpdate(
      { workflow: workflow._id, isDefault: true },
      { $push: { users: req.body.user } },
    ).then((updated) => {
      console.log('Updated thread after new users push', updated);
    }).catch((errThread) => {
      console.log('Error adding users to default thread', errThread);
    });
    // Finally return new member + error
    res.json({ user: req.body.user });
  }
};

/**
 * Show the current Member
 */
const read = (req, res) => {
  const workflow = req.workflow;
  console.log('READ member', workflow.users, req.params, workflow.users.find(user => user._id.toString() === req.params.userId.toString()));
  const member = workflow.users.find(user => user._id.toString() === req.params.userId.toString());
  if (!member) {
    return res.status(404).send('Member not found');
  }
  res.json(prepareMember(member));
};

/**
 * Update a Member
 */
const update = (req, res) => {
  return res.status(404).send('Member not found');
};

/**
 * Remove an Member
 */
const remove = (req, res) => {
  const userId = req.params.userId;
  const workflow = req.workflow;

  // remove member from workflow
  workflow.users = _.filter(workflow.users, user => user._id.toString() !== userId);
  workflow.roles = _.filter(workflow.roles, role => role.user === userId);

  workflow.save()
    .then(saved => res.json(prepareWorkflow(saved, req.user)))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Member
 */
const list = (req, res) => {
  const workflow = req.workflow;
  res.json(workflow.users);
};

export { create, read, update, remove, list };
