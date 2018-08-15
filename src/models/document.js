import fs from 'fs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const DocSchema = new Schema({
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
 * Remove document file
 */
DocSchema.pre('remove', function preRemove(next) {
  fs.unlink(`./public/uploads/${this.file}`, () => next());
});

export default mongoose.model('Document', DocSchema);
