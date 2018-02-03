import path from 'path';
import mongoose from 'mongoose';
import _ from 'lodash';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import Workflow from '../models/workflow';
import Member from '../models/member';
import { errorHandler } from '../helpers/error-messages';
import { prepareWorkflow } from '../helpers/workflows';
// import slug from 'slug';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const smtpTransport = nodemailer.createTransport(env.mailer.options);
smtpTransport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve(path.join(__dirname, '..', 'templates')),
  extName: '.html',
}));

/**
 * Create a Workflow
 */
const create = (req, res) => {
  const workflow = new Workflow(req.body);

  workflow.user = req.user;

  workflow.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email' }, (err, populated) => {
        res.jsonp(prepareWorkflow(populated, req.user));
      });
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Show the current Workflow
 */
const read = (req, res) => {
  res.jsonp(prepareWorkflow(req.workflow, req.user));
};

/**
 * Update a Workflow
 */
const update = (req, res) => {
  let workflow = req.workflow;

  // prevent empty password
  if (req.body.password && !req.body.password.length) {
    delete req.body.password;
  }

  workflow = _.extend(workflow, req.body);

  workflow.save()
    .then((savedWorkflow) => {
      res.jsonp(prepareWorkflow(savedWorkflow, req.user));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Remove a Workflow
 */
const remove = (req, res) => {
  const workflow = req.workflow;

  workflow.remove()
    .then(removedWorkflow => res.jsonp(prepareWorkflow(removedWorkflow, req.user)))
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * List of Workflows
 */
const list = (req, res) => {
  const user = req.user;

  Member.find({ user }, '_id')
    .then((members) => {
      const membersIds = members.map(m => m._id);
      Workflow.find({ $or: [{ user: req.user }, { members: { $in: membersIds } }] }, '-password')
        .sort('-created')
        .deepPopulate('user members.user')
        .exec()
        .then(workflows => res.jsonp(workflows))
        .catch(err => res.status(500).send(errorHandler(err)));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Search workflows
 */
const search = (req, res) => {
  Workflow.find({ $text: { $search: req.query.terms } }, '-password')
    .sort('-created')
    .deepPopulate('user members.user')
    .exec()
    .then(workflows => res.jsonp(workflows))
    .catch(err => res.status(500).send(errorHandler(err)));
};

const authenticate = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;

  if (workflow.authenticate(req.body.password)) {
    // add member
    const member = new Member({ user, workflowId: workflow._id });
    member.save()
      .then(() => {
        // add saved member to the workflow
        workflow.members.push(member);
        workflow.save()
          .then((savedWorkflow) => {
            // return saved workflow
            res.jsonp({
              message: `Tu es maintenant membre du workflow ${savedWorkflow.name}`,
              workflow: prepareWorkflow(savedWorkflow, req.user),
            });
          })
          .catch(err => res.status(500).send(errorHandler(err)));
      })
      .catch(err => res.status(500).send(errorHandler(err)));
  } else {
    res.status(403).jsonp({ message: 'Le mot de passe est incorrect' });
  }
};

const leave = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;

  console.log(workflow.user, user);
  if (workflow.user._id.toString() === user._id.toString()) {
    res.status(400).send({ message: 'Vous ne pouvez pas quitter un workflow dont vous êtes propriétaire' });
  }

  Member.findOne({ user: user._id, workflowId: workflow._id })
    .then((member) => {
      if (!member) {
        res.status(404).send({ message: "Ce membre n'existe pas" });
      }
      workflow.members.remove({ _id: member._id });
      member.remove()
        .then(() => {
          workflow.save()
            .then((savedWorkflow) => {
              res.jsonp(prepareWorkflow(savedWorkflow, req.user));
            })
            .catch(err => res.status(500).send(errorHandler(err)));
        })
        .catch(err => res.status(500).send(errorHandler(err)));
    })
    .catch(err => res.status(500).send(errorHandler(err)));
};

/**
 * Workflow invitation
 */
const invitation = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const emails = req.body.emails.filter(e => EMAIL_REGEX.test(e));

  emails.map(e => new Promise((resolve) => {
    const token = jwt.sign(e, env.jwtSecret, { expiresIn: '2h' });
    workflow.accessTokens.push(token);
    workflow.save()
      .then(() => {
        const mailOptions = {
          to: e,
          from: env.mailer.from,
          subject: 'Invitation à rejoindre un Workflow sur Wouvy',
          template: 'workflow-invitation',
          context: {
            userName: user.username || `${user.lastname} ${user.firstname}`,
            userMail: user.email,
            workflowName: workflow.name,
            workflowAccessLink: `${env.appUrl}/invitation?token=${token}`,
          },
        };
        smtpTransport.sendMail(mailOptions, (errMail) => {
          if (!errMail) {
            resolve({ success: true, message: `Invitation envoyé à ${e}` });
          } else {
            resolve({ success: false, message: `Echec de l'envoie de l'invitation à ${e}` });
          }
        });
      })
      .catch(err => resolve({ success: false, message: errorHandler(err) }));
  }));

  // send emails
  Promise.all(emails).then((results) => {
    const sentEmails = results.filter(r => r.success === true).map(r => r.message);
    const errors = results.filter(r => r.success === false).map(r => r.message);
    res.jsonp({ sentEmails, errors });
  });
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
    .deepPopulate('user members members.user')
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

/**
 * Workflow middleware to find by Id OR Slug
 */
const workflowByIdOrSlug = (req, res, next, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    Workflow
      .findById(id)
      .deepPopulate('user members members.user')
      .exec()
      .then((workflow) => {
        if (!workflow) {
          return res.status(404).send({ message: 'Workflow not found' });
        }
        req.workflow = workflow;
        next();
      })
      .catch(err => next(err));
  } else {
    Workflow
      .findOne({ slug: id })
      .deepPopulate('user members members.user')
      .exec()
      .then((workflow) => {
        if (!workflow) {
          return res.status(404).send({ message: 'Workflow not found' });
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
  authenticate,
  leave,
  invitation,
  workflowByID,
  workflowByIdOrSlug,
};
