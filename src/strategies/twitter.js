import TwitterStrategy from 'passport-twitter';
// import User from '../models/user';

const twitterStrategy = (passport, twitterConfig) => {
  passport.use(new TwitterStrategy({
    clientID: twitterConfig.clientID,
    clientSecret: twitterConfig.clientSecret,
    callbackURL: '/api/auth/twitter/callback',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const twitterData = profile._json;
    console.log('TWITTER AUTH CALLBACK', twitterData);
    // find user by mail and twitter provider id
    /*
    User.findOne({ email: twitterData.emails[0].value, 'providers.twitter.id': twitterData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: twitterData.emails[0].value,
          firstname: twitterData.name.givenName,
          lastname: twitterData.name.familyName,
          username: twitterData.displayName,
          password: Math.random().toString(36).slice(2),
          picture: twitterData.image.url,
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
    */
    done();
  }));
};

export default twitterStrategy;
