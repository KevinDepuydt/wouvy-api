import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Poll Schema
 */
const PollSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Workflow is missing',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: "La sujet du sondage n'a pas été renseignée",
  },
  choices: [{
    text: {
      type: String,
      required: 'La contenu du choix est vide',
    },
    votes: [{
      type: Schema.ObjectId,
      ref: 'User',
      default: [],
    }],
  }],
  hasVoted: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

PollSchema.pre('save', function preSave(next) {
  this.hasVoted = this.choices.reduce((acc, choice) => acc.concat(choice.votes), []);
  next();
});

export default mongoose.model('Poll', PollSchema);
