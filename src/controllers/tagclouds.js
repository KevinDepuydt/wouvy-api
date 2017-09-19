import mongoose from 'mongoose';
import _ from 'lodash';
import TagCloud from '../models/tagcloud';

/**
 * Create a TagCloud
 */
const create = (req, res) => {
  const tagCloud = new TagCloud(req.body);

  if (tagCloud.published) {
    tagCloud.newsFeedDate = Date.now();
  }

  tagCloud.save()
    .then(savedTagCloud => res.jsonp(savedTagCloud))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current TagCloud
 */
const read = (req, res) => {
  const tagCloud = req.tagCloud ? req.tagCloud.toJSON() : {};

  // extra field can be added here
  res.jsonp(tagCloud);
};

/**
 * Update a TagCloud
 */
const update = (req, res) => {
  let tagCloud = req.tagCloud;

  tagCloud = _.extend(tagCloud, req.body);

  tagCloud.save()
    .then(savedTagCloud => res.jsonp(savedTagCloud))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove a TagCloud
 */
const remove = (req, res) => {
  const tagCloud = req.tagCloud;

  tagCloud.remove()
    .then(removedTagCloud => res.jsonp(removedTagCloud))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of TagCloud
 */
const list = (req, res) => {
  TagCloud.find().sort('-created').exec()
    .then(tagClouds => res.jsonp(tagClouds))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * TagCloud middleware
 */
const tagCloudByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TagCloud id is not valid',
    });
  }

  TagCloud.findById(id)
    .then((tagCloud) => {
      if (!tagCloud) {
        return res.status(404).send({
          message: 'Tag Cloud not found',
        });
      }
      req.tagCloud = tagCloud;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, tagCloudByID };
