import mongoose from 'mongoose';
import Message from './message';

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

/**
 * Hook a pre save method to hash the password
 */
ThreadSchema.pre('remove', function preRemove(next) {
  // delete messages
  Message.remove({ _id: { $in: this.messages } });
  next();
});

export default mongoose.model('Thread', ThreadSchema);
