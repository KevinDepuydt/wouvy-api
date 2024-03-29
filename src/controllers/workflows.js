import path from 'path';
import _ from 'lodash';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isMongoId from 'validator/lib/isMongoId';
import env from '../config/env';
import Workflow from '../models/workflow';
import Thread from '../models/thread';
import { errorHandler } from '../helpers/error-messages';
import { prepareWorkflow } from '../helpers/workflows';
import { getImagePath } from '../helpers/templates';
// import slug from 'slug';

const smtpTransport = nodemailer.createTransport(env.mailer.options);
smtpTransport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve(path.join(__dirname, '..', 'templates')),
  extName: '.handlebars',
}));

/**
const tasksLabels = [
  { name: 'mémo', color: '#73df89' },
  { name: 'à faire', color: '#a8a3ed' },
  { name: 'urgent', color: '#ffd91b' },
];
 */

/**
 * Create a Workflow
 */
const create = (req, res) => {
  const { user, body } = req;
  const workflow = new Workflow({
    user,
    ...body,
  });

  // add creator to workflow members admin
  workflow.users.push(user);
  workflow.roles.push({ user, role: env.userRoles.admin });
  workflow.save()
    .then((saved) => {
      // Create default thread
      const thread = new Thread({ workflow, user, name: 'Général', isDefault: true });
      thread.save();
      // Then save workflow
      saved
        .populate({ path: 'user', select: 'email' })
        .populate({ path: 'roles.user', select: '_id' })
        .populate({ path: 'users', select: 'email' }, (err, populated) => {
          res.json(prepareWorkflow(populated, req.user));
        });
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Show the current Workflow
 */
const read = (req, res) => {
  res.json(prepareWorkflow(req.workflow, req.user));
};

/**
 * Update a Workflow
 */
const update = (req, res) => {
  let { workflow } = req;

  // prevent empty password
  if (req.body.password && !req.body.password.length) {
    delete req.body.password;
  }

  workflow = _.extend(workflow, req.body);

  workflow.save()
    .then((savedWorkflow) => {
      res.json(prepareWorkflow(savedWorkflow, req.user));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Remove a Workflow
 */
const remove = (req, res) => {
  const { workflow } = req;

  workflow.remove()
    .then(removedWorkflow => res.json(prepareWorkflow(removedWorkflow, req.user)))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * List of Workflows
 */
const list = (req, res) => {
  const { user } = req;
  Workflow.find({ $or: [{ user }, { users: user }] }, 'name user users roles created starred')
    .sort('-created')
    .deepPopulate('user users roles.user')
    .exec()
    .then(workflows => res.json(workflows.map(w => prepareWorkflow(w, req.user))))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Search workflows
 */
const search = (req, res) => {
  Workflow.find({ $text: { $search: req.query.terms } }, '-password')
    .sort('-created')
    .deepPopulate('user users roles.user')
    .exec()
    .then(workflows => res.json(workflows))
    .catch(err => res.status(500).send(errorHandler(err)));
};

const authenticate = (req, res) => {
  const { user, workflow } = req;

  if (workflow.authenticate(req.body.password)) {
    // add member
    // add saved member to the workflow
    workflow.users.push(user);
    workflow.roles.push({ user: user._id, role: env.userRoles.member });
    workflow.save()
      .then((saved) => {
        saved
          .populate({ path: 'user', select: 'email' })
          .populate({ path: 'roles.user', select: '_id' })
          .populate({ path: 'users', select: 'email' }, (err, populated) => {
            // return saved workflow
            res.json({
              message: `Tu es maintenant membre du workflow ${populated.name}`,
              workflow: prepareWorkflow(populated, req.user),
            });
          });
      })
      .catch(err => res.status(500).send(errorHandler(err)));
  } else {
    res.status(403).json({ message: 'Le mot de passe est incorrect' });
  }
};

const leave = (req, res) => {
  const { user, workflow } = req;

  if (workflow.user._id.toString() === user._id.toString()) {
    res.status(400).send({ message: 'Vous ne pouvez pas quitter un workflow dont vous êtes propriétaire' });
  }

  workflow.users.remove({ _id: user._id });
  const roleIndex = workflow.roles.indexOf(role => role.user === user._id);
  if (roleIndex !== -1) {
    workflow.roles.splice(roleIndex, 1);
  }
  // Remove from each groups
  workflow.save()
    .then((savedWorkflow) => {
      res.json(prepareWorkflow(savedWorkflow, req.user));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Workflow invitation
 */
const invitation = (req, res) => {
  const { user, workflow, body } = req;
  let emails = body.emails.filter(e => isEmail(e));

  emails = emails.map(e => new Promise((resolve) => {
    const token = jwt.sign({ email: e, workflowId: workflow._id }, env.jwtSecret, { expiresIn: '1h' });
    if (workflow.accessTokens.indexOf(token) !== -1) {
      resolve({ success: false, message: 'Une invitation a déjà été généré pour cet email.' });
    }
    workflow.accessTokens.push(token);
    workflow.save()
      .then(() => {
        const mailOptions = {
          to: e,
          from: env.mailer.from,
          subject: 'Invitation à rejoindre un Workflow sur Wouvy',
          template: 'workflow-invitation',
          context: {
            userName: user.firstname.length > 0 ? _.capitalize(user.firstname) : user.username ? _.capitalize(user.username) : 'Un utilisateur',
            workflowName: workflow.name,
            workflowAccessLink: `${env.appUrl}/invitation?token=${token}`,
            path: {
              logo: getImagePath('logo-wouvy-gray.png'),
              elliot: getImagePath('elliot.jpg'),
            },
          },
        };
        smtpTransport.sendMail(mailOptions, (errMail) => {
          if (!errMail) {
            resolve({ success: true, email: e });
          } else {
            resolve({ success: false, email: e });
          }
        });
      })
      .catch(err => resolve({ success: false, message: errorHandler(err) }));
  }));

  // send emails
  Promise.all(emails).then((results) => {
    const success = results.filter(r => r.success === true).map(r => r.email);
    const errors = results.filter(r => r.success === false).map(r => r.email);
    res.json({
      total: results.length,
      isSuccess: success.length === results.length,
      success: {
        number: success.length,
        message: success.length > 0 ? `Invitation envoyée à ${success.join(', ')}` : null,
      },
      errors: {
        number: errors.length,
        message: errors.length > 0 ? `Echec de l'envoie de l'invitation à ${errors.join(', ')}` : null,
      },
    });
  });
};

const subscribe = (req, res) => {
  const { user, query } = req;
  const { token } = query;

  if (!user) {
    return res.status(403).send({ message: 'User not logged' });
  }

  Workflow.findOne({ accessTokens: { $in: [token] } })
    .then((workflow) => {
      if (!workflow) {
        return res.status(200).send({ success: false, message: "Le token d'accès n'est pas valide" });
      }
      jwt.verify(token, env.jwtSecret, (err, decoded) => {
        if (err) {
          return res.status(200).send({ success: false, message: "Le token d'accès n'est pas valide" });
        }
        const { email, workflowId } = decoded;
        if (email !== user.email || workflowId.toString() !== workflow._id.toString()) {
          return res.status(200).send({ success: false, message: "Le token d'accès n'est pas valide" });
        }
        // pull token and add new member from user
        workflow.accessTokens.pull(token);
        workflow.users.push(user);
        workflow.roles.push({ user, role: env.userRoles.member });
        workflow.save()
          .then((savedWf) => {
            res.json({
              success: true,
              workflow: savedWf,
              message: 'Vous avez été ajouté au workflow!',
            });
          })
          .catch(errWf => res.status(200).send({
            success: false,
            message: errorHandler(errWf),
          }));
      });
    })
    .catch(err => res.status(200).send({
      success: false,
      message: errorHandler(err),
    }));
};

/**
 * Workflow middleware
 */
const workflowByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Workflow id is not valid',
    });
  }

  Workflow
    .findById(id)
    .deepPopulate('user users roles.user')
    .exec()
    .then((workflow) => {
      if (!workflow) {
        return res.status(404).send({ message: 'Workflow not found' });
      }
      req.workflow = workflow;
      next();
    })
    .catch(err => next(err));
};

export {
  create,
  read,
  update,
  remove,
  list,
  search,
  authenticate,
  leave,
  invitation,
  subscribe,
  workflowByID,
};
