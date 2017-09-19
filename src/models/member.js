import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
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
  },
  tasks: [{
    type: Schema.ObjectId,
    ref: 'Task',
  }],
  rights: {
    workflows: {
      type: Number,
      default: rights.NONE.level,
    },
    users: {
      type: Number,
      default: rights.NONE.level,
    },
    tagClouds: {
      type: Number,
      default: rights.NONE.level,
    },
    documents: {
      type: Number,
      default: rights.NONE.level,
    },
    photos: {
      type: Number,
      default: rights.NONE.level,
    },
    votes: {
      type: Number,
      default: rights.NONE.level,
    },
    news: {
      type: Number,
      default: rights.NONE.level,
    },
    logo: {
      type: Number,
      default: rights.NONE.level,
    },
    questions: {
      type: Number,
      default: rights.NONE.level,
    },
    sponsors: {
      type: Number,
      default: rights.NONE.level,
    },
  },
  validated: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugin to deep populate
 */
MemberSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: '-salt -password',
    },
  },
});

export default mongoose.model('Member', MemberSchema);
