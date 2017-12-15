import mongoose from 'mongoose';
import _ from 'lodash';
import Photo from '../models/photo';

/**
 * Create a Photo
 */
const create = (req, res) => {
  const photo = new Photo(req.body);

  photo.save()
    .then(savedPhoto => res.jsonp(savedPhoto))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Show the current Photo
 */
const read = (req, res) => {
  const photo = req.photo ? req.photo.toJSON() : {};

  // extra field can be added here
  res.jsonp(photo);
};

/**
 * Update a Photo
 */
const update = (req, res) => {
  let photo = req.photo;

  photo = _.extend(photo, req.body);

  photo.save()
    .then(savedPhoto => res.jsonp(savedPhoto))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Remove a Photo
 */
const remove = (req, res) => {
  const photo = req.photo;

  photo.remove()
    .then(removedPhoto => res.jsonp(removedPhoto))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * List of Photo
 */
const list = (req, res) => {
  Photo.find().sort('-created').exec()
    .then(photos => res.jsonp(photos))
    .catch(err => res.status(500).send({ message: err }));
};

/**
 * Photo middleware
 */
const photoByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Photo id is not valid',
    });
  }

  Photo.findById(id)
    .then((photo) => {
      if (!photo) {
        return res.status(404).send({
          message: 'Photo not found',
        });
      }
      req.photo = photo;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, photoByID };
