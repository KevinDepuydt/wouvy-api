import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Document from '../models/document';
import { prepareWorkflow } from '../helpers/workflows';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Document
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const doc = new Document(Object.assign(req.body, { user }));

  doc.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        workflow.documents.push(populated);
        workflow.save()
          .then((savedWorkflow) => {
            res.jsonp({
              workflow: prepareWorkflow(savedWorkflow, user),
              document: populated,
            });
          })
          .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Document
 */
const read = (req, res) => {
  const doc = req.doc ? req.doc.toJSON() : {};

  // extra field can be added here
  res.jsonp(doc);
};

/**
 * Update a Document
 */
const update = (req, res) => {
  let doc = req.doc;

  doc = _.extend(doc, req.body);

  doc.save()
    .then(savedDoc => res.jsonp(savedDoc))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Document
 */
const remove = (req, res) => {
  const doc = req.doc;

  doc.remove()
    .then(removedDoc => res.jsonp(removedDoc))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Documents
 */
const list = (req, res) => {
  Document.find().sort('-created').exec()
    .then(documents => res.jsonp(documents))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Document middleware
 */
const documentByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({ message: 'Document id is not valid' });
  }

  Document.findById(id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).send({ message: 'Document not found' });
      }
      req.doc = doc;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, documentByID };
