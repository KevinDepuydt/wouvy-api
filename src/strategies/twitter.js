import TwitterStrategy from 'passport-twitter';
import User from '../models/user';

const twitterStrategy = (passport, twitterConfig) => {
  passport.use(new TwitterStrategy({
    consumerKey: twitterConfig.clientID,
    consumerSecret: twitterConfig.clientSecret,
    callbackURL: '/api/auth/twitter/callback',
    includeEmail: true,
    profileFields: ['id', 'name', 'profile_image_url_https'],
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const twitterData = profile._json;
    // find user by mail and twitter provider id
    User.findOne({ email: twitterData.email, 'providers.twitter.id': twitterData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: twitterData.email,
          username: twitterData.name,
          password: Math.random().toString(36).slice(2),
          picture: twitterData.profile_image_url_https,
          'providers.google': {
            id: twitterData.id,
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

export default twitterStrategy;
