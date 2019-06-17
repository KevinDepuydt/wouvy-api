import mongoose, { Schema } from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import env from '../config/env';
import TagSchema from './tag';

const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Workflow Schema
 */
const WorkflowSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: 'Veuillez saisir un nom pour votre workflow.',
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
  roles: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: Object,
      enum: Object.keys(env.userRoles).map(role => env.userRoles[role]),
      default: env.userRoles.member,
    },
  }],
  rights: {
    tasks: {
      add: {
        type: Number,
        default: env.userRoles.member.level,
      },
      edit: {
        type: Number,
        default: env.userRoles.member.level,
      },
      remove: {
        type: Number,
        default: env.userRoles.moderator.level,
      },
    },
    documents: {
      add: {
        type: Number,
        default: env.userRoles.member.level,
      },
      edit: {
        type: Number,
        default: env.userRoles.member.level,
      },
      remove: {
        type: Number,
        default: env.userRoles.moderator.level,
      },
    },
    polls: {
      add: {
        type: Number,
        default: env.userRoles.member.level,
      },
      edit: {
        type: Number,
        default: env.userRoles.member.level,
      },
      remove: {
        type: Number,
        default: env.userRoles.moderator.level,
      },
    },
    members: {
      add: {
        type: Number,
        default: env.userRoles.moderator.level,
      },
      edit: {
        type: Number,
        default: env.userRoles.admin.level,
      },
      remove: {
        type: Number,
        default: env.userRoles.admin.level,
      },
    },
  },
  starred: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: [],
  }],
  tags: [TagSchema],
  accessTokens: [{
    type: String,
    default: [],
  }],
  password: {
    type: String,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  usePushEach: true,
});

/**
 * Search indexes
 */
WorkflowSchema.index({ name: 'text', /* slug: 'text', */ description: 'text' });

/**
 * Unique plugin
 */
WorkflowSchema.plugin(uniqueValidator);

/**
 * Plugin to deep populate
 */
WorkflowSchema.plugin(deepPopulatePlugin, {
  populate: {
    user: {
      select: 'email',
    },
    users: {
      select: 'email username lastname firstname picture avatar lastActivity',
    },
    'roles.user': {
      select: '_id',
    },
  },
});

/**
 * Hook a pre save method to validate slug and has the password
 */
WorkflowSchema.pre('save', function preSave(next) {
  // this.slug = this.slug.toLowerCase();

  if (this.password && this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Method to hash password
 */
WorkflowSchema.methods.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

/**
 * Create instance method for authenticating user
 */
WorkflowSchema.methods.authenticate = function authenticate(password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('Workflow', WorkflowSchema);
