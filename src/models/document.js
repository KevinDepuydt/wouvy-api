import fs from 'fs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const DocSchema = new Schema({
  name: {
    type: String,
    required: 'Saisissez le nom de votre document',
  },
  description: {
    type: String,
    default: '',
  },
  file: {
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
 * Remove document file
 */
DocSchema.pre('remove', function preRemove(next) {
  fs.unlink(`./public/uploads/documents/${this.file}`, () => next());
});

export default mongoose.model('Document', DocSchema);
