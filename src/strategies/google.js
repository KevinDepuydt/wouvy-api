import GoogleStrategy from 'passport-google-oauth';

const googleStrategy = (passport, googleConfig) => {
  passport.use(new GoogleStrategy.OAuth2Strategy({
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret,
    callbackURL: '/api/auth/facebook/callback',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    // Set the provider data and include tokens
    console.log('*** GOOGLE AUTH CALLBACK ***');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log('*** END ***');
    done();
  }));
};

export default googleStrategy;
