import fs from 'fs';
import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const Schema = mongoose.Schema;
const deepPopulatePlugin = deepPopulate(mongoose);

/**
 * Workflow Schema
 */
const WorkflowSchema = new Schema({
  slug: {
    type: String,
    default: '',
    dropDups: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    default: '',
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
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'Member',
  }],
  questions: [{
    type: Schema.ObjectId,
    ref: 'Question',
  }],
  documents: [{
    type: Schema.ObjectId,
    ref: 'Doc',
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
  public: {
    type: Boolean,
    default: false,
  },
  autoValidationDomains: {
    type: [String],
    default: [],
  },
  accessToken: {
    type: String,
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
 * Plugin to deep populate
 */
WorkflowSchema.plugin(deepPopulatePlugin, {
  populate: {
    'members.user': {
      select: '-salt -password',
    },
    'questions.user': {
      select: 'displayName profileImageURL',
    },
  },
});

/**
 * Hook a pre save method to validate slug
 */
WorkflowSchema.pre('save', function preSave(next) {
  this.slug = this.slug.toLowerCase();
  next();
});

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

  // delete members
  for (const member of this.members) {
    member.remove();
  }

  // delete logo file
  if (this.logo.length > 0) {
    fs.unlink(this.logo, () => console.log('Success delete logo'));
  }

  next();
});

export default mongoose.model('Workflow', WorkflowSchema);
