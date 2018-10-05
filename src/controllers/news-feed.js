import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import NewsFeedItem from '../models/news-feed-item';
import Comment from '../models/comment';

/**
 * Create a NewsFeedItem
 */
const create = (req, res) => {
  const item = new NewsFeedItem(req.body);

  item.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current NewsFeedItem
 */
const read = (req, res) => {
  const item = req.newsFeedItem ? req.newsFeedItem.toJSON() : {};

  // extra field can be added here
  res.jsonp(item);
};

/**
 * Update a NewsFeedItem
 */
const update = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  let item = req.newsFeedItem;

  // delete data
  delete req.body.data;
  delete req.body.user;

  item = _.extend(item, req.body);

  item.save()
    .then((saved) => {
      res.jsonp(saved);
      io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-updated', item);
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove an NewsFeedItem
 */
const remove = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const item = req.newsFeedItem;

  item.remove()
    .then((removed) => {
      res.jsonp(removed);
      io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', removed);
      console.log('news feed item removed', removed);
      if (removed.data.task) {
        console.log('Remove task', removed.data.task);
        removed.data.task.remove()
          .then((removedTask) => {
            io.to(`w/${workflow._id}/tasks`).emit('task-deleted', removedTask);
            workflow.tasks.splice(workflow.tasks.findIndex(p => p._id === removedTask._id), 1);
            workflow.save();
          })
          .catch(err => res.status(500).send({ message: err }));
      }
      if (removed.data.document) {
        removed.data.document.remove()
          .then((removedDocument) => {
            io.to(`w/${workflow._id}/documents`).emit('document-deleted', removedDocument);
            workflow.documents.splice(
              workflow.documents.findIndex(p => p._id === removedDocument._id),
              1,
            );
            workflow.save();
          })
          .catch(err => res.status(500).send({ message: err }));
      }
      if (removed.data.poll) {
        removed.data.poll.remove()
          .then((removedPoll) => {
            io.to(`w/${workflow._id}/polls`).emit('poll-deleted', removedPoll);
            workflow.polls.splice(workflow.polls.findIndex(p => p._id === removedPoll._id), 1);
            workflow.save();
          })
          .catch(err => res.status(500).send({ message: err }));
      }
      if (removed.data.post) {
        removed.data.post.remove();
      }
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of NewsFeedItem
 */
const list = (req, res) => {
  const workflow = req.workflow;
  NewsFeedItem.find({ workflow })
    .sort('-created')
    .deepPopulate('user comments comments.user data.task data.task.owner data.post data.post.user data.document data.poll data.poll.user')
    .exec()
    .then(items => res.jsonp(items))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Add comment to news feed item
 */
const addComment = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const io = req.io;
  const item = req.newsFeedItem;
  const comment = new Comment(Object.assign(req.body, { user }));

  comment.save()
    .then((savedComment) => {
      savedComment.populate({ path: 'user', select: '' }, (err, populated) => {
        item.comments.push(populated);
        item.save()
          .then(() => {
            res.jsonp(populated);
            io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-updated', item);
          })
          .catch(err => res.status(500).send({ message: err }));
      }).catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Update comment of news feed item
 */
const updateComment = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const item = req.newsFeedItem;
  let comment = req.comment;

  // delete data
  delete req.body.user;

  comment = _.extend(comment, req.body);

  comment.save()
    .then((savedComment) => {
      savedComment.populate({ path: 'user', select: '' }, (err, populated) => {
        res.jsonp(populated);
        io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-comment-updated', { item: { _id: item._id }, comment: populated });
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Delete comment from news feed item
 */
const removeComment = (req, res) => {
  const workflow = req.workflow;
  const io = req.io;
  const item = req.newsFeedItem;
  const comment = req.comment;

  comment.remove()
    .then((removed) => {
      const commentIdx = item.comments.findIndex(c => c._id === comment._id);
      item.comments.splice(commentIdx, 1);
      item.save()
        .then(() => {
          res.jsonp(removed);
          io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-comment-deleted', { item: { _id: item._id }, comment });
        })
        .catch(err => res.status(500).send({ message: err }));
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * NewsFeedItem middleware
 */
const newsFeedItemByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'NewsFeedItem id is not invalid',
    });
  }

  NewsFeedItem
    .findById(id)
    .deepPopulate('user comments comments.user data.task data.task.owner data.post data.post.user data.document data.poll data.poll.user')
    .exec()
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: 'NewsFeedItem not found',
        });
      }
      req.newsFeedItem = item;
      next();
    })
    .catch(err => next(err));
};

/**
 * NewsFeedItem comment middleware
 */
const commentByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Comment id is not invalid',
    });
  }

  Comment
    .findById(id)
    .populate({ path: 'user', select: '' })
    .exec()
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: 'NewsFeedItem not found',
        });
      }
      req.comment = item;
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
  addComment,
  updateComment,
  removeComment,
  newsFeedItemByID,
  commentByID,
};
