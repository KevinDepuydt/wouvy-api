import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: 'Veuillez saisir votre question',
  },
  answer: {
    type: String,
    default: '',
  },
  oralAnswer: {
    type: Boolean,
    default: false,
  },
  haveAnswer: {
    type: Boolean,
    default: false,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  datePosted: {
    type: Date,
    default: Date.now(),
  },
  dateValidated: {
    type: Date,
    default: null,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  likedBy: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  like: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Question', QuestionSchema);
