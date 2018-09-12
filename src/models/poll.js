import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Poll Schema
 */
const PollSchema = new Schema({
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
    type: Schema.ObjectId,
    ref: 'PollChoice',
    unique: 'Ce choix fait déjà parti des choix du sondage',
    default: [],
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

PollSchema.pre('save', function preSave(next) {
  this.choices.forEach(choice => choice.save());
  next();
});

PollSchema.pre('remove', function preRemove(next) {
  this.choices.forEach(choice => choice.remove());
  next();
});

export default mongoose.model('Poll', PollSchema);
