import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Post from '../models/post';
import NewsFeedItem from '../models/news-feed-item';

/**
 * Create a News
 */
const create = (req, res) => {
  const user = req.user;
  const workflow = req.workflow;
  const io = req.io;
  const post = new Post(Object.assign(req.body, { user }));

  post.save()
    .then((saved) => {
      // NewsFeedItem of the task
      res.jsonp(saved);
      const item = new NewsFeedItem({ user, workflow: workflow._id, type: 'post', data: { post } });
      item.save().then(() => {
        io.to(`w/${workflow._id}/dashboard`).emit('news-feed-item-created', item);
      });
    })
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current News
 */
const read = (req, res) => {
  const post = req.wfPost ? req.wfPost.toJSON() : {};

  // extra field can be added here
  res.jsonp(post);
};

/**
 * Update a News
 */
const update = (req, res) => {
  let post = req.wfPost;

  post = _.extend(post, req.body);

  post.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove an News
 */
const remove = (req, res) => {
  const post = req.wfPost;

  post.remove()
    .then(removed => res.jsonp(removed))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of News
 */
const list = (req, res) => {
  Post.find().sort('-created').exec()
    .then(posts => res.jsonp(posts))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * News middleware
 */
const postByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Post id is not invalid',
    });
  }

  Post.findById(id)
    .then((wfPost) => {
      if (!wfPost) {
        return res.status(404).send({
          message: 'Post not found',
        });
      }
      req.wfPost = wfPost;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, postByID };
