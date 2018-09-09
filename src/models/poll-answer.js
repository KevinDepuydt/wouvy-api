import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Poll Schema
 */
const PollAnswerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: 'La contenu de la réponse est vide',
  },
  percent: {
    type: Number,
    validate: [n => n >= 0 && n <= 100, 'Invalid percentage'],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PollAnswer', PollAnswerSchema);
