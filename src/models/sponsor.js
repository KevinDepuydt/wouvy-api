import fs from 'fs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Sponsor Schema
 */
const SponsorSchema = new Schema({
  name: {
    type: String,
    required: '',
    unique: true,
  },
  image: {
    type: String,
    default: '',
  },
});

/**
 * Remove sponsor photo
 */
SponsorSchema.pre('remove', function preRemove(next) {
  if (this.image.length) {
    fs.unlink(`./public/uploads/sponsors/${this.image}`, () => next());
  }
});

export default mongoose.model('Sponsor', SponsorSchema);
