import mongoose from 'mongoose';
import _ from 'lodash';
import Vote from '../models/vote';

/**
 * Create a Vote
 */
const create = (req, res) => {
  const vote = new Vote(req.body);

  if (vote.published) {
    vote.newsFeedDate = Date.now();
  }

  vote.save()
    .then(savedVote => res.jsonp(savedVote))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current Vote
 */
const read = (req, res) => {
  const vote = req.vote ? req.vote.toJSON() : {};

  // extra field can be added here
  res.jsonp(vote);
};

/**
 * Update a Vote
 */
const update = (req, res) => {
  let vote = req.vote;

  vote = _.extend(vote, req.body);

  // calculate answers percentage before update
  vote.answers = calculatePercent(vote.answers, vote);

  vote.save()
    .then(savedVote => res.jsonp(savedVote))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove a Vote
 */
const remove = (req, res) => {
  const vote = req.vote;

  vote.remove()
    .then(removedVote => res.jsonp(removedVote))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Votes
 */
const list = (req, res) => {
  Vote.find().sort('-created').exec()
    .then(votes => res.jsonp(votes))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Vote middleware
 */
const voteByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vote id is not valid',
    });
  }

  Vote.findById(id).deepPopulate('answers.users').exec()
    .then((vote) => {
      if (!vote) {
        return res.status(404).send({
          message: 'Vote not found',
        });
      }
      req.vote = vote;
      next();
    })
    .catch(err => next(err));
};

const getPercentageOfAnswer = (vote, answer) => {
  return vote.answersNumber > 0 ? Math.round((answer.count * 100) / vote.answersNumber) : 0;
};

const calculatePercent = (answers, vote) => {
  answers.forEach((answer, index) => {
    answers[index].percent = getPercentageOfAnswer(vote, answer);
  });
  return answers;
};

export { create, read, update, remove, list, voteByID };
