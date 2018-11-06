import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Document Schema
 */
const ThreadSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Workflow is missing',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Une conversation doit avoir un propriétaire',
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  name: {
    type: String,
    default: '',
  },
  messages: [{
    type: Schema.ObjectId,
    ref: 'Message',
  }],
  created: {
    type: Date,
    default: Date.now,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  usePushEach: true,
});

/**
 * Deep populate
 */
ThreadSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: 'email',
    },
    users: {
      select: 'firstname lastname username email',
    },
    'messages.user': {
      select: 'firstname lastname username picture email',
    },
  },
});

/**
 * Hook a pre save method to hash the password
 */
ThreadSchema.post('remove', function preRemove() {
  this.messages.forEach(m => m.remove());
});

export default mongoose.model('Thread', ThreadSchema);
