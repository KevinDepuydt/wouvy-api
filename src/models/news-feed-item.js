import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const deepPopulatePlugin = deepPopulate(mongoose);
const { Schema } = mongoose;

const newsFeedItemTypes = ['post', 'poll', 'document', 'task'];

/**
 * Post Schema
 */
const NewsFeedItemSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Workflow is missing',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: newsFeedItemTypes,
    required: 'The post must have a type (text, poll, document, task)',
  },
  data: {
    post: {
      type: Schema.ObjectId,
      ref: 'Post',
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
  }],
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment',
  }],
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  usePushEach: true,
});

/**
 * Plugin to deep populate
 */
NewsFeedItemSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: 'email username lastname firstname picture avatar',
    },
    'comments.user': {
      select: 'email username lastname firstname picture avatar',
    },
    'data.task': {
      select: '-private',
    },
    'data.task.user': {
      select: 'email username lastname firstname picture avatar',
    },
    'data.post.user': {
      select: 'email username lastname firstname picture avatar',
    },
    'data.poll.user': {
      select: 'email username lastname firstname picture avatar',
    },
  },
});

NewsFeedItemSchema.pre('save', function preSave(next) {
  // verify that
  if (this.data[this.type]) {
    next();
  }
});

export default mongoose.model('NewsFeedItem', NewsFeedItemSchema);
