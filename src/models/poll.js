import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Poll Schema
 */
const PollSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  question: {
    type: String,
    required: "La question du sondage n'a pas été renseignée",
  },
  answers: [{
    type: 'PollAnswer',
    unique: 'Cette réponse est déjà dans le sondage',
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Poll', PollSchema);
