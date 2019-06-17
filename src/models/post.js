import mongoose, { Schema } from 'mongoose';

/**
 * Post Schema
 */
const PostSchema = new Schema({
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
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: 'Votre post ne contient pas de texte',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Post', PostSchema);
