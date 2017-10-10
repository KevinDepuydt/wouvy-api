import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

const validateAnswersNumber = answers => answers.length > 1 && answers.length <= 10;

/**
 * Vote Answer Schema
 */
const VoteAnswerSchema = new Schema({
  answer: {
    type: String,
    required: 'L\'une des réponses est vide',
  },
  goodAnswer: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 0,
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  percent: {
    type: Number,
    default: 0,
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
  usersWhoAnswered: {
    type: [Schema.ObjectId],
    ref: 'User',
    default: [],
  },
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
    'answers.users': {
      select: 'displayName email',
    },
  },
});

export default mongoose.model('Vote', VoteSchema);
