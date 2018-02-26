import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Message Schema
 */
const MessageSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: 'Votre message est vide',
  },
  attachment: {
    type: String,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Message', MessageSchema);
