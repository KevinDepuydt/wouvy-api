import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Poll Schema
 */
const PollChoiceSchema = new Schema({
  text: {
    type: String,
    required: 'La contenu du choix est vide',
  },
  votes: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
});

export default mongoose.model('PollChoice', PollChoiceSchema);
