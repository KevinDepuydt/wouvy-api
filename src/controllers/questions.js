import mongoose from 'mongoose';
import _ from 'lodash';
import Question from '../models/question';

/**
 * Create a Question
 */
const create = (req, res) => {
  const question = new Question(req.body);

  if (question.published) {
    question.newsFeedDate = Date.now();
  }

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current Question
 */
const read = (req, res) => {
  const question = req.question ? req.question.toJSON() : {};

  // extra field can be added here
  res.jsonp(question);
};

/**
 * Update a Question
 */
const update = (req, res) => {
  let question = req.question;

  question = _.extend(question, req.body);

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove a Question
 */
const remove = (req, res) => {
  const question = req.question;

  question.remove()
    .then(removedDoc => res.jsonp(removedDoc))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of Question
 */
const list = (req, res) => {
  Question.find().sort('-created').exec()
    .then(questions => res.jsonp(questions))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Like a question
 */
const like = (req, res) => {
  const question = req.question;

  // @TODO: rework this to use mongo query
  // add like and user
  question.like += 1;
  question.likedBy.push(req.user);

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Dislike a question
 */
const dislike = (req, res) => {
  const question = req.question;

  // @TODO: rework this to use mongo query
  // remove like and user
  question.like -= 1;
  question.likedBy.splice(question.likedBy.indexOf(req.user), 1);

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Set a question as favorite
 */
const validate = (req, res) => {
  const question = req.question;

  // validate question
  question.dateValidated = Date.now();
  question.isValid = true;

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Set a question as favorite
 */
const favorite = (req, res) => {
  const question = req.question;

  // validate and set as favorite
  question.dateValidated = Date.now();
  question.isValid = true;
  question.isFavorite = true;

  question.save()
    .then(savedQuestion => res.jsonp(savedQuestion))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Question middleware
 */
const questionByID = (req, res, next, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Question id is not valid',
    });
  }

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          message: 'Question not found',
        });
      }
      req.question = question;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, like, dislike, validate, favorite, questionByID };
