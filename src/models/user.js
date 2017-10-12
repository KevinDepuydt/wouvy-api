import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Email is required',
    unique: true,
  },
  firstname: {
    type: String,
    default: '',
  },
  lastname: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: 'Password is required',
  },
  providers: {
    facebook: {},
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function hash(next) {
  if (this.password && this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Method to hash password
 */
UserSchema.methods.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function authenticate(password) {
  return bcrypt.compareSync(password, this.password);
};


export default mongoose.model('User', UserSchema);
