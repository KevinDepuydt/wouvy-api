import _ from 'lodash';
import env from '../config/env';
import Workflow from '../models/workflow';
import Thread from '../models/thread';
import { prepareMember } from '../helpers/members';

/**
 * Create a Workflow
 */
const addUser = (req, res) => {
  const workflow = req.workflow;

  console.log('Users to add', req.body);

  if (req.body.users) { // many members
    // add members to workflow
    const roles = req.body.users.map(user => ({ user, role: env.userRoles.member }));
    console.log('ROLES', roles);
    Workflow.findOneAndUpdate({ _id: workflow._id }, {
      $push: {
        users: { $each: req.body.users },
        roles: { $each: roles },
      },
    }).then((updated) => {
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
    Workflow.findOneAndUpdate({ _id: workflow._id }, { $push: { users: req.body.user } })
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
 * Show the current Workflow
 */
const readUser = (req, res) => {
  const workflow = req.workflow;
  const member = workflow.users.find(user => user._id.toString() === req.params.userId.toString());
  if (!member) {
    return res.status(404).send('Member not found');
  }
  return res.json(prepareMember(member));
};

/**
 * Update a Workflow
 */
const updateUser = (req, res) => {
  return res.status(404).send('Member not found');
};

/**
 * Remove a Workflow
 */
const removeUser = (req, res) => {
  const userId = req.params.userId.toString();
  const workflow = req.workflow;

  // remove member from workflow
  workflow.users = _.filter(workflow.users, user => user._id.toString() !== userId.toString());
  workflow.roles = _.filter(workflow.roles, role => role.user._id.toString() !== userId.toString());

  console.log('Workflow users', workflow.users.map(u => u._id), userId);

  workflow.save()
    .then(() => res.json(req.user))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Workflows
 */
const listUsers = (req, res) => {
  const workflow = req.workflow;
  res.json(workflow.users);
};

const updateUserRole = (req, res) => {
  const wf = req.workflow;
  const idx = wf.roles.findIndex(r => r.user._id.toString() === req.params.userId.toString());
  const role = {
    user: req.params.userId,
    role: env.userRoles[req.body.level ? req.body.level : 0],
  };
  if (idx !== -1) {
    wf.roles[idx] = role;
  } else {
    // set default role if any
    wf.roles.push(role);
  }

  console.log('New role', role, req.body);

  wf.save()
    .then(() => res.json(role.role))
    .catch(err => res.status(500).send({ message: err }));
};

export {
  addUser,
  readUser,
  updateUser,
  removeUser,
  listUsers,
  updateUserRole,
};
