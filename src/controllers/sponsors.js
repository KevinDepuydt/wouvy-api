import mongoose from 'mongoose';
import _ from 'lodash';
import Sponsor from '../models/sponsor';

/**
 * Create a Sponsor
 */
const create = (req, res) => {
  const sponsor = new Sponsor(req.body);

  sponsor.save()
    .then(savedSponsor => res.jsonp(savedSponsor))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current Sponsor
 */
const read = (req, res) => {
  const sponsor = req.sponsor ? req.sponsor.toJSON() : {};

  // extra field can be added here
  res.jsonp(sponsor);
};

/**
 * Update a Sponsor
 */
const update = (req, res) => {
  let sponsor = req.sponsor;

  sponsor = _.extend(sponsor, req.body);

  sponsor.save()
    .then(savedSponsor => res.jsonp(savedSponsor))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove a Sponsor
 */
const remove = (req, res) => {
  const sponsor = req.sponsor;

  sponsor.remove()
    .then(removedSponsor => res.jsonp(removedSponsor))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Sponsor
 */
const list = (req, res) => {
  Sponsor.find().sort('-created').exec()
    .then(documents => res.jsonp(documents))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Sponsor middleware
 */
const sponsorByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sponsor id is not valid',
    });
  }

  Sponsor.findById(id)
    .then((sponsor) => {
      if (!sponsor) {
        return res.status(404).send({
          message: 'Sponsor not found',
        });
      }
      req.sponsor = sponsor;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, sponsorByID };
