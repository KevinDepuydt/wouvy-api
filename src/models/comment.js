import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Post Schema
 */
const CommentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: 'Le commentaire ne contient pas de texte',
  },
  likes: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Comment', CommentSchema);
