import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Folder from '../models/folder';
import { errorHandler } from '../helpers/error-messages';
import Document from '../models/document';
import NewsFeedItem from '../models/news-feed-item';

/**
 * Get Library
 */
const getWorkflowLibrary = async (req, res) => {
  const workflow = req.workflow;

  try {
    // find folders
    const library = await Folder.findOne({ workflow, isRoot: true })
      .populate('documents')
      .populate({ path: 'documents', populate: { path: 'user', select: 'email firstname lastname email picture avatar' } })
      .populate('folders')
      .exec();
    return res.jsonp(library);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * create a Document and add it to a Folder
 */
const createDocument = async (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const parentFolder = req.parentFolder;
  const io = req.io;

  try {
    // create new document
    const doc = await Document.create({ workflow, user, ...req.body });

    // add to folder
    parentFolder.documents.push(doc);
    await parentFolder.save();

    // populate and send document
    const populated = await Document.populate(doc, { path: 'user', select: 'email firstname lastname email picture avatar' });
    io.to(`w/${workflow._id}/library`).emit('document-created', populated);

    // create and send a news feed item for the created document
    const newsFeedItem = await NewsFeedItem.create({ user, workflow, type: 'document', data: { document: populated } });
    io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-created', newsFeedItem);

    // finally return created document
    return res.jsonp(populated);
  } catch (err) {
    // handle errors
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Read a document
 */
const readDocument = (req, res) => {
  const doc = req.doc ? req.doc.toJSON() : {};
  return res.jsonp(doc);
};

/**
 * Update a document
 */
const updateDocument = async (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  let doc = req.doc;

  try {
    // update document
    doc = _.extend(doc, req.body);

    // save and populate document
    const saved = await doc.save();
    const populated = await Document.populate(saved, { path: 'user', select: 'email firstname lastname email picture avatar' });

    // send updated document
    io.to(`w/${workflow._id}/library`).emit('document-updated', populated);
    return res.jsonp(populated);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Remove a document and remove it from his folder
 */
const removeDocument = async (req, res) => {
  const workflow = req.workflow;
  const parentFolder = req.parentFolder;
  const io = req.io;
  const doc = req.doc;

  try {
    // remove document from his parent folder
    const documentIndex = parentFolder.documents.findIndex(d => d._id === doc._id);
    if (documentIndex !== -1) {
      parentFolder.documents.splice(documentIndex, 1);
      parentFolder.markModified('documents');
      await parentFolder.save();
    }

    // remove document and send removed document to workflow
    await doc.remove();
    io.to(`w/${workflow._id}/library`).emit('document-deleted', doc);

    // remove associated news feed item and send removed news feed item
    const newsFeedItem = await NewsFeedItem.findOneAndRemove({ 'data.document': doc._id });
    io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', newsFeedItem);

    return res.jsonp(doc);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Create a Folder
 */
const createFolder = async (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const parentFolder = req.parentFolder;
  const io = req.io;

  try {
    // save new folder
    const folder = await Folder.create({ workflow, user, ...req.body });

    // add folder to parent folder
    parentFolder.folders.push(folder);
    await parentFolder.save();

    // send created folder to workflow
    io.to(`w/${workflow._id}/library`).emit('folder-created', folder);
    return res.jsonp(folder);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Show the current Folder
 */
const readFolder = (req, res) => {
  const folder = req.folder ? req.folder.toJSON() : {};
  res.jsonp(folder);
};

/**
 * Update a Folder
 */
const updateFolder = async (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  let folder = req.folder;

  try {
    // update folder
    folder = _.extend(folder, req.body);
    await folder.save();

    // send updated folder to workflow
    io.to(`w/${workflow._id}/library`).emit('folder-updated', folder);
    return res.jsonp(folder);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Remove a Folder
 */
const removeFolder = async (req, res) => {
  const workflow = req.workflow;
  const parentFolder = req.parentFolder;
  const io = req.io;
  const folder = req.folder;

  try {
    // remove document from his parent folder
    const folderIndex = parentFolder.folders.findIndex(f => f._id === folder._id);
    if (folderIndex !== -1) {
      parentFolder.folders.splice(folderIndex, 1);
      parentFolder.markModified('folders');
      await parentFolder.save();
    }

    // remove folder and send removed folder to workflow
    await folder.remove();
    io.to(`w/${workflow._id}/library`).emit('folder-deleted', folder);
    return res.jsonp(folder);
  } catch (err) {
    return res.status(500).send(errorHandler(err));
  }
};

/**
 * Document middleware
 */
const documentByID = async (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({ message: 'Document id is not valid' });
  }

  try {
    // get document
    const doc = await Document.findById(id);

    // handle document not found
    if (!doc) {
      return res.status(404).send({ message: 'Document not found' });
    }

    // attach document to request
    req.doc = doc;
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Folder middleware
 */
const parentFolderByID = async (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({ message: 'Folder id is not valid' });
  }

  try {
    // get folder
    const folder = await Folder.findById(id);

    // handle folder not found
    if (!folder) {
      return res.status(404).send({ message: 'Folder not found' });
    }

    // attach document to request
    req.parentFolder = folder;
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Folder middleware
 */
const folderByID = async (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({ message: 'Folder id is not valid' });
  }

  try {
    // get folder
    const folder = await Folder.findById(id);

    // handle folder not found
    if (!folder) {
      return res.status(404).send({ message: 'Folder not found' });
    }

    // attach document to request
    req.folder = folder;
    return next();
  } catch (err) {
    return next(err);
  }
};

export {
  getWorkflowLibrary,
  createFolder,
  readFolder,
  updateFolder,
  removeFolder,
  createDocument,
  readDocument,
  updateDocument,
  removeDocument,
  documentByID,
  parentFolderByID,
  folderByID,
};
