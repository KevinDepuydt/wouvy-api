import fs from 'fs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Photo Schema
 */
const PhotoSchema = new Schema({
  title: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: 'No image provided',
  },
  published: {
    type: Boolean,
    default: false,
  },
  newsFeedDate: {
    type: Date,
    default: null,
  },
});

/**
 * Remove photo file
 */
PhotoSchema.pre('remove', function preRemove(next) {
  fs.unlink(`./public/uploads/photos/${this.image}`, () => next());
});

export default mongoose.model('Photo', PhotoSchema);
