import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Document from '../models/document';
import NewsFeedItem from '../models/news-feed-item';

/**
 * Create a Document
 */
const create = (req, res) => {
  const { workflow, io, user, body } = req;
  const doc = new Document({ workflow, user, ...body });

  doc.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.json(populated);
        io.to(`w/${workflow._id}/documents`).emit('document-created', populated);
        // NewsFeedItem of the task
        const item = new NewsFeedItem({ user, workflow, type: 'document', data: { document: populated } });
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
  res.json(doc);
};

/**
 * Update a Document
 */
const update = (req, res) => {
  const { workflow, io } = req;
  let { doc } = req;

  doc = _.extend(doc, req.body);

  doc.save()
    .then((saved) => {
      saved.populate({ path: 'user', select: 'email firstname lastname email' }, (err, populated) => {
        res.json(populated);
        io.to(`w/${workflow._id}/documents`).emit('document-updated', populated);
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Document
 */
const remove = (req, res) => {
  const { workflow, io, doc } = req;

  doc.remove()
    .then((removedDoc) => {
      res.json(removedDoc);
      io.to(`w/${workflow._id}/documents`).emit('document-deleted', removedDoc);
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
  Document
    .find({ workflow: req.workflow._id })
    .populate({ path: 'user', select: 'email firstname lastname email' })
    .sort('-created')
    .exec()
    .then(documents => res.json(documents))
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
