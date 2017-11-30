import GoogleStrategy from 'passport-google-oauth2';
import User from '../models/user';

const googleStrategy = (passport, googleConfig) => {
  passport.use(new GoogleStrategy({
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret,
    callbackURL: '/api/auth/google/callback',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const googleData = profile._json;
    // find user by mail and google provider id
    User.findOne({ email: googleData.emails[0].value, 'providers.google.id': googleData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: googleData.emails[0].value,
          firstname: googleData.name.givenName,
          lastname: googleData.name.familyName,
          username: googleData.displayName,
          password: Math.random().toString(36).slice(2),
          picture: googleData.image.url,
          'providers.google': {
            id: googleData.id,
            accessToken,
            refreshToken,
          },
        });
        // add new User
        newUser.save()
          .then(savedUser => done(null, savedUser))
          .catch((errB) => {
            // looking for existing user with another social network
            // to add new social network to his account
            User.findOne({ email: googleData.emails[0].value, 'providers.google': { $exists: false }, providers: { $not: { $size: 0 } } }, (errC, existingUser) => {
              if (errC) {
                done(errC, null);
              } else if (existingUser) {
                if (!existingUser.providers.google) {
                  existingUser.providers.google = {
                    id: googleData.id,
                    accessToken,
                    refreshToken,
                  };
                  existingUser.save()
                    .then(savedExistingUser => done(null, savedExistingUser))
                    .catch(errD => done(errD, null));
                }
              } else {
                done(errB, null);
              }
            });
          });
      }
    });
  }));
};

export default googleStrategy;
