import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

const validateAnswersNumber = answers => answers.length > 1 && answers.length <= 10;

/**
 * Vote Answer Schema
 */
const VoteAnswerSchema = new Schema({
  text: {
    type: String,
    required: 'L\'une des réponses est vide',
  },
});

/**
 * Vote Schema
 */
const VoteSchema = new Schema({
  question: {
    type: String,
    unique: true,
    required: 'Vous devez renseigner la question',
  },
  multipleAnswers: {
    type: Boolean,
    default: false,
  },
  answers: {
    type: [VoteAnswerSchema],
    validate: [validateAnswersNumber, 'Veuillez saisir entre 2 et 10 réponses'],
    default: [],
  },
  answersNumber: {
    type: Number,
    default: 0,
  },
  results: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    answers: [{
      type: Schema.ObjectId,
      ref: VoteAnswerSchema,
    }],
  }],
  isResultPublic: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugin to deep populate
 */
VoteSchema.plugin(deepPopulatePlugin, {
  populate: {
    'results.users': {
      select: 'displayName email',
    },
  },
});

export default mongoose.model('Vote', VoteSchema);
