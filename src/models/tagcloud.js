import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * TagCloud Schema
 */
const TagCloudSchema = new Schema({
  theme: {
    type: String,
    required: 'Veuillez saisir le thème du nuage de mot',
  },
  words: [{
    type: String,
  }],
  newsFeedDate: {
    type: Date,
    default: null,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('TagCloud', TagCloudSchema);
