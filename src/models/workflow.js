import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import TagSchema from './tag';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Workflow Schema
 */
const WorkflowSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  /*
  slug: {
    type: String,
    default: '',
    dropDups: true,
    unique: 'Un workflow avec cette url personnalisé existe déjà',
    trim: true,
  },
  */
  name: {
    type: String,
    required: 'Veuillez saisir un nom pour votre workflow.',
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'Member',
  }],
  threads: [{
    type: Schema.ObjectId,
    ref: 'Thread',
  }],
  tasks: [{
    type: Schema.ObjectId,
    ref: 'Task',
  }],
  tags: [TagSchema],
  tasksLabels: [TagSchema],
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
    owner: {
      select: 'email',
    },
    'members.user': {
      select: 'email username lastname firstname picture',
    },
    'threads.user': {
      select: 'email username lastname firstname picture',
    },
    'threads.owner': {
      select: 'email username lastname firstname picture',
    },
    tasks: {
      options: {
        sort: { created: -1 },
      },
    },
    'tasks.owner': {
      select: 'email username lastname firstname picture',
    },
    'tasks.users': {
      select: 'email username lastname firstname picture',
    },
    'tasks.members.user': {
      select: 'email username lastname firstname picture',
    },
    'tasks.subTasks.users': {
      select: 'email username lastname firstname picture',
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
 * Hook a post remove method
 */
WorkflowSchema.post('remove', function postRemove() {
  // remove members
  this.members.forEach(m => m.remove());
  this.threads.forEach(t => t.remove());
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
