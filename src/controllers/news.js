import mongoose from 'mongoose';
import _ from 'lodash';
import News from '../models/news';

/**
 * Create a News
 */
const create = (req, res) => {
  const news = new News(req.body);

  if (news.published) {
    news.newsFeedDate = Date.now();
  }

  news.save()
    .then(savedNews => res.jsonp(savedNews))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Show the current News
 */
const read = (req, res) => {
  const news = req.news ? req.news.toJSON() : {};

  // extra field can be added here
  res.jsonp(news);
};

/**
 * Update a News
 */
const update = (req, res) => {
  let news = req.news;

  news = _.extend(news, req.body);

  news.save()
    .then(savedNews => res.jsonp(savedNews))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * Remove an News
 */
const remove = (req, res) => {
  const news = req.news;

  news.remove()
    .then(removedNews => res.jsonp(removedNews))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * List of News
 */
const list = (req, res) => {
  News.find().sort('-created').exec()
    .then(newsList => res.jsonp(newsList))
    .catch(err => res.status(400).send({ message: err }));
};

/**
 * News middleware
 */
const newsByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'News id is not invalid',
    });
  }

  News.findById(id)
    .then((news) => {
      if (!news) {
        return res.status(404).send({
          message: 'News not found',
        });
      }
      req.news = news;
      next();
    })
    .catch(err => next(err));
};

export { create, read, update, remove, list, newsByID };
