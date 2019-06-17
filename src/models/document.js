import fs from 'fs';
import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';

const platforms = {
  drive: ['drive.google.com', 'docs.google.com'],
  dropbox: ['dropbox.com'],
};

const getPlatformFromFile = (file) => {
  let platform = 'wouvy';
  _.each(platforms, (items, key) => {
    _.each(items, (item) => {
      if (file.indexOf(item) !== -1) {
        platform = key;
      }
    });
  });
  return platform;
};

/**
 * Document Schema
 */
const DocSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Workflow is missing',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: 'Saisissez le nom de votre document',
  },
  file: {
    type: String,
    required: 'Votre document n‘est relié à aucun fichier',
  },
  platform: {
    type: String,
    enum: ['drive', 'dropbox', 'wouvy'],
    default: 'wouvy',
  },
  description: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Get document platform
 */
DocSchema.pre('save', function preSave(next) {
  // get link platform
  this.platform = getPlatformFromFile(this.file);
  next();
});

/**
 * Remove document file
 */
DocSchema.pre('remove', function preRemove(next) {
  fs.unlink(`./public/uploads/${this.file}`, () => next());
});

export default mongoose.model('Document', DocSchema);
