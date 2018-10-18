import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import Message from './message';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Document Schema
 */
const ThreadSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Une conversation doit avoir un propriétaire',
  },
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
    owner: {
      select: 'email',
    },
    users: {
      select: 'firstname lastname username',
    },
    'messages.user': {
      select: 'firstname lastname username picture',
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
