import LinkedInStrategy from 'passport-linkedin';
import User from '../models/user';

const linkedinStrategy = (passport, linkedinConfig) => {
  passport.use(new LinkedInStrategy({
    consumerKey: linkedinConfig.clientID,
    consumerSecret: linkedinConfig.clientSecret,
    callbackURL: '/api/auth/linkedin/callback',
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url'],
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const linkedinData = profile._json;
    // find user by mail and linkedin provider id
    User.findOne({ email: linkedinData.emailAddress, 'providers.linkedin.id': linkedinData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: linkedinData.emailAddress,
          firstname: linkedinData.firstName,
          lastname: linkedinData.lastName,
          password: Math.random().toString(36).slice(2),
          picture: linkedinData.pictureUrl,
          'providers.linkedin': {
            id: linkedinData.id,
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
            User.findOne({ email: linkedinData.emailAddress, 'providers.linkedin': { $exists: false }, providers: { $not: { $size: 0 } } }, (errC, existingUser) => {
              if (errC) {
                done(errC, null);
              } else if (existingUser) {
                if (!existingUser.providers.linkedin) {
                  existingUser.providers.linkedin = {
                    id: linkedinData.id,
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

export default linkedinStrategy;
