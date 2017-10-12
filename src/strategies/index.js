import User from '../models/user';
import localStrategy from './local';

const passportStrategies = (passport) => {
  /**
   * Load passport strategies
   */
  localStrategy(passport); // local

  /**
   * define de/serialize user methods
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, '-salt -password', (err, user) => {
      done(err, user);
    });
  });
};

export default passportStrategies;
