import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Member Schema
 */
const MemberSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  workflowId: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin'],
    default: 'member',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

MemberSchema.index({ user: 1, workflowId: 1 }, { unique: true });

/**
 * Unique plugin
 */
MemberSchema.plugin(uniqueValidator, { message: 'Vous êtes déjà membre de ce workflow!' });

/**
 * Plugin to deep populate
 */
MemberSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: '-password',
    },
  },
});

export default mongoose.model('Member', MemberSchema);
