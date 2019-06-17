import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import NewsFeedItem from '../models/news-feed-item';
import Comment from '../models/comment';

/**
 * Create a NewsFeedItem
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const item = new NewsFeedItem({ workflow, ...req.body });

  item.save()
    .then(saved => res.json(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current NewsFeedItem
 */
const read = (req, res) => {
  const item = req.newsFeedItem ? req.newsFeedItem.toJSON() : {};

  // extra field can be added here
  res.json(item);
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
  delete req.body.comments;

  item = _.extend(item, req.body);

  console.log('item', item.comments);

  item.save()
    .then((saved) => {
      res.json(saved);
      io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-updated', item);
    })
    .catch((err) => {
      console.log('ERR', err);
      return res.status(500).send({ message: err });
    });
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
      res.json(removed);
      io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-deleted', removed);
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
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 0;

  NewsFeedItem.find({ workflow: req.workflow._id })
    .limit(limit)
    .skip(skip)
    .sort('-created')
    .deepPopulate('user comments comments.user data.task data.task.user data.post data.post.user data.document data.poll data.poll.user')
    .exec()
    .then(items => res.json(items))
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
      savedComment.populate({ path: 'user', select: 'email username lastname firstname picture avatar' }, (err, populated) => {
        item.comments.push(populated);
        item.save()
          .then(() => {
            res.json(populated);
            io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-updated', item);
          })
          .catch(errBis => res.status(500).send({ message: errBis, step: 1 }));
      });
    })
    .catch(errCommentSave => res.status(500).send({ message: errCommentSave, step: 3 }));
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
      savedComment.populate({ path: 'user', select: 'email username lastname firstname picture avatar' }, (err, populated) => {
        res.json(populated);
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
          res.json(removed);
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
    .deepPopulate('user comments comments.user data.task data.task.user data.post data.post.user data.document data.poll data.poll.user')
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
