import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: 'First name is required',
  },
  lastname: {
    type: String,
    required: 'Last name is required',
  },
  username: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: 'Password is required',
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
