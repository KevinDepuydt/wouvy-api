import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const ThreadSchema = new Schema({
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: Schema.ObjectId,
    ref: 'Message',
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Thread', ThreadSchema);
