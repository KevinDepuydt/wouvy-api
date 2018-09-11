import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Poll Schema
 */
const PollAnswerSchema = new Schema({
  text: {
    type: String,
    required: 'La contenu de la réponse est vide',
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
});

export default mongoose.model('PollAnswer', PollAnswerSchema);
