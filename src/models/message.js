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
  message: {
    type: String,
    required: 'Message vide',
  },
  file: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Message', MessageSchema);
