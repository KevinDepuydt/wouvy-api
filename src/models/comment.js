import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Post Schema
 */
const CommentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: 'Le commentaire est vide',
  },
  likes: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  usePushEach: true,
});

export default mongoose.model('Comment', CommentSchema);
