import fs from 'fs';
import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import env from '../config/env';

const rights = env.rights;

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Workflow Schema
 */
const WorkflowSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  slug: {
    type: String,
    default: '',
    dropDups: true,
    unique: 'Un workflow avec cette url personnalisé existe déjà',
    trim: true,
  },
  name: {
    type: String,
    required: 'Please fill Workflow name',
    trim: true,
  },
  description: {
    type: String,
    default: 'Description of the workflow',
  },
  logo: {
    type: String,
    default: '',
  },
  members: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      unique: 'Cet utilisateur est déjà membre du workflow !',
    },
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
    created: {
      type: Date,
      default: Date.now,
    },
  }],
  questions: [{
    type: Schema.ObjectId,
    ref: 'Question',
  }],
  documents: [{
    type: Schema.ObjectId,
    ref: 'Document',
  }],
  votes: [{
    type: Schema.ObjectId,
    ref: 'Vote',
  }],
  photos: [{
    type: Schema.ObjectId,
    ref: 'Photo',
  }],
  tagClouds: [{
    type: Schema.ObjectId,
    ref: 'TagCloud',
  }],
  news: [{
    type: Schema.ObjectId,
    ref: 'News',
  }],
  sponsors: [{
    type: Schema.ObjectId,
    ref: 'Sponsor',
  }],
  enabledFeatures: {
    tagClouds: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Boolean,
      default: false,
    },
    photos: {
      type: Boolean,
      default: false,
    },
    votes: {
      type: Boolean,
      default: false,
    },
    news: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: Boolean,
      default: false,
    },
    sponsors: {
      type: Boolean,
      default: false,
    },
    chat: {
      type: Boolean,
      default: false,
    },
  },
  limit: {
    type: Number,
    default: 0,
  },
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
WorkflowSchema.index({ name: 'text', slug: 'text', description: 'text' });

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
    'members.user': {
      select: 'email',
    },
    'questions.user': {
      select: 'email displayName picture',
    },
  },
});

/**
 * Hook a pre save method to validate slug and has the password
 */
WorkflowSchema.pre('save', function preSave(next) {
  this.slug = this.slug.toLowerCase();

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

/**
 * Hook a pre remove method to remove documents
 */
WorkflowSchema.pre('remove', function preRemove(next) {
  // delete documents
  for (const doc of this.documents) {
    doc.remove();
  }

  // delete questions
  for (const question of this.questions) {
    question.remove();
  }

  // delete news
  for (const news of this.news) {
    news.remove();
  }

  // delete sponsors
  for (const sponsor of this.sponsors) {
    sponsor.remove();
  }

  // delete photo album items
  for (const photo of this.photos) {
    photo.remove();
  }

  // delete votes
  for (const vote of this.votes) {
    vote.remove();
  }

  // delete logo file
  if (this.logo.length > 0) {
    fs.unlink(this.logo, () => console.log('Success delete logo'));
  }

  next();
});

export default mongoose.model('Workflow', WorkflowSchema);
