import env from '../config/env';
import User from '../models/user';
import localStrategy from './local';
import facebookStrategy from './facebook';
import googleStrategy from './google';
import linkedinStrategy from './linkedin';
import twitterStrategy from './twitter';
import githubStrategy from './github';

const passportStrategies = (passport) => {
  /**
   * Load passport strategies
   */
  localStrategy(passport); // local
  facebookStrategy(passport, env.socialCredentials.facebook); // facebook
  googleStrategy(passport, env.socialCredentials.google); // google
  linkedinStrategy(passport, env.socialCredentials.linkedin); // linkedin
  twitterStrategy(passport, env.socialCredentials.twitter); // twitter
  githubStrategy(passport, env.socialCredentials.github); // github

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
