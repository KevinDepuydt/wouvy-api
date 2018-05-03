import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Tag Schema
 */
const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

export default TagSchema;
