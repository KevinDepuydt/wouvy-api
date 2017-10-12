import FacebookStrategy from 'passport-facebook';

const facebookStrategy = (passport, facebookConfig) => {
  passport.use(new FacebookStrategy({
    clientID: facebookConfig.clientID,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    // @TODO look for user with email + providerName.id eql to profile.id
    console.log('*** FB AUTH CALLBACK ***');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log('*** END ***');
    done();
  }));
};

export default facebookStrategy;
