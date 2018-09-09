import _ from 'lodash';
import isMongoId from 'validator/lib/isMongoId';
import Post from '../models/post';

/**
 * Create a Post
 */
const create = (req, res) => {
  const workflow = req.workflow;
  const user = req.user;
  const io = req.io;
  const post = new Post(req.body);

  post.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Post
 */
const read = (req, res) => {
  const post = req.wfPost ? req.wfPost.toJSON() : {};

  // extra field can be added here
  res.jsonp(post);
};

/**
 * Update a Post
 */
const update = (req, res) => {
  let post = req.wfPost;

  post = _.extend(post, req.body);

  post.save()
    .then(saved => res.jsonp(saved))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove an Post
 */
const remove = (req, res) => {
  const post = req.wfPost;

  post.remove()
    .then(removed => res.jsonp(removed))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Post
 */
const list = (req, res) => {
  const workflow = req.workflow;
  Post.find({ workflow })
    .sort('-created')
    .deepPopulate('user data.task data.task.owner data.text data.document')
    .exec()
    .then(posts => res.jsonp(posts))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Post middleware
 */
const postByID = (req, res, next, id) => {
  if (!isMongoId(id)) {
    return res.status(400).send({
      message: 'Post id is not invalid',
    });
  }

  Post.findById(id)
    .then((post) => {
      if (!post) {
        return res.status(404).send({
          message: 'Post not found',
        });
      }
      req.wfPost = post;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, postByID };
