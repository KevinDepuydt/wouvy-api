import LocalStrategy from 'passport-local';
import User from '../models/user';

const localStrategy = (passport) => {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Identifiants incorrects.',
        });
      }

      return done(null, user);
    });
  }));
};

export default localStrategy;
