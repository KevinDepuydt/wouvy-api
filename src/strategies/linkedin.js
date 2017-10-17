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
          .catch(errUser => done(errUser, null));
      }
    });
  }));
};

export default linkedinStrategy;
