import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Document from '../models/document';
import NewsFeedItem from '../models/news-feed-item';
import { prepareWorkflow } from '../helpers/workflows';
import { errorHandler } from '../helpers/error-messages';

/**
 * Create a Document
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
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
            io.to(`w/${workflow._id}/documents`).emit('document-created', populated);
          })
          .catch(errWorkflow => res.status(500).send(errorHandler(errWorkflow)));
        // NewsFeedItem of the task
        const item = new NewsFeedItem({ user, workflow: workflow._id, type: 'document', data: { document: populated } });
        item.save().then(() => {
          io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-created', item);
        });
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
  const workflow = req.workflow;
  const io = req.io;
  let doc = req.doc;

  doc = _.extend(doc, req.body);

  doc.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.jsonp(populated);
        io.to(`w/${workflow._id}/documents`).emit('document-updated', populated);
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Document
 */
const remove = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const doc = req.doc;

  doc.remove()
    .then((removedDoc) => {
      res.jsonp(removedDoc);
      io.to(`w/${workflow._id}/documents`).emit('document-deleted', removedDoc);
      workflow.documents.splice(workflow.documents.findIndex(p => p._id === removedDoc._id), 1);
      workflow.save();
      NewsFeedItem.findOneAndRemove({ 'data.document': removedDoc._id })
        .then((removedItem) => {
          io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', removedItem);
        })
        .catch(err => res.status(500).send({ message: err }));
    })
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
