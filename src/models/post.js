import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

const postTypes = ['text', 'poll', 'document', 'task'];

/**
 * Post Schema
 */
const PostSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Invalid post workflow',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: postTypes,
    required: 'The post must have a type (text, poll, document, task)',
  },
  data: {
    text: {
      type: String,
      default: null,
    },
    poll: {
      type: Schema.ObjectId,
      ref: 'Poll',
      default: null,
    },
    document: {
      type: Schema.ObjectId,
      ref: 'Document',
      default: null,
    },
    task: {
      type: Schema.ObjectId,
      ref: 'Task',
      default: null,
    },
  },
  likes: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment',
    default: [],
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugin to deep populate
 */
PostSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: 'email username lastname firstname picture',
    },
    'data.task': {
      select: '-private',
    },
    'data.task.owner': {
      select: 'email username lastname firstname picture',
    },
  },
});

PostSchema.pre('save', function preSave(next) {
  // verify that
  if (!this.data[this.type]) {
    console.log('TYPE ERROR');
  } else {
    next();
  }
});

export default mongoose.model('Post', PostSchema);
