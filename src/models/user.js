import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import { getAvatarFromText } from '../helpers/letters-avatar';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Veuillez renseigner une adresse email',
    unique: 'Cette adresse email est déjà prise',
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
  picture: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: 'Veuillez renseigner un mot de passe',
  },
  providers: {
    facebook: {},
    google: {},
    linkedin: {},
    github: {},
    twitter: {},
  },
  created: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
    default: null,
  },
});

/**
 * Search indexes
 */
UserSchema.index({ email: 'text', firstname: 'text', lastname: 'text', username: 'text' });

/**
 * Unique plugin
 */
UserSchema.plugin(uniqueValidator);

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function hash(next) {
  if (!this.picture) {
    const text = this.lastname && this.firstname ? `${this.lastname[0]}${this.firstname[0]}` : this.email;
    this.picture = getAvatarFromText(text);
  }

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
