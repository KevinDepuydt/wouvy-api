import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * News Schema
 */
const NewsSchema = new Schema({
  title: {
    type: String,
    required: 'Donner un titre a votre news',
    unique: true,
  },
  description: {
    type: String,
    required: 'Votre news ne contient pas de description',
  },
  published: {
    type: Boolean,
    default: false,
  },
  newsFeedDate: {
    type: Date,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('News', NewsSchema);
