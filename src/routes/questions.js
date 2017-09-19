import { Router } from 'express';
import * as question from '../controllers/questions';

const questionsRoutes = Router();

questionsRoutes.route('/questions')
  .get(question.list)
  .post(question.create);

questionsRoutes.route('/questions/:questionId')
  .get(question.read)
  .put(question.update)
  .delete(question.remove);

questionsRoutes.route('/questions/:questionId/like').post(question.like);
questionsRoutes.route('/questions/:questionId/dislike').post(question.dislike);
questionsRoutes.route('/questions/:questionId/validate').post(question.validate);
questionsRoutes.route('/questions/:questionId/favorite').post(question.favorite);

questionsRoutes.param('questionId', question.questionByID);

export default questionsRoutes;
