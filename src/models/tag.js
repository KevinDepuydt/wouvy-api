import { Schema } from 'mongoose';

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
});

export default TagSchema;
