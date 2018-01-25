import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import uniqueValidator from 'mongoose-unique-validator';
import env from '../config/env';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);
const rights = env.rights;

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
  rights: {
    workflow: {
      type: Number,
      default: rights.NONE.level,
    },
    member: {
      type: Number,
      default: rights.NONE.level,
    },
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
