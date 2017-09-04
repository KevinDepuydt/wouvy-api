import mongoose from 'mongoose';
import env from '../env/index';

// Initialize Mongoose
export const connect = (cb) => {
  mongoose.Promise = Promise;

  const db = mongoose.connect(env.db.uri, env.db.options, (err) => {
    // Log Error
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    } else {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', env.db.debug);
      // Call callback FN
      if (cb) cb(db);
    }
  });
};
