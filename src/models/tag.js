import mongoose from 'mongoose';

const { Schema } = mongoose;

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
