import LinkedInStrategy from 'passport-linkedin';

const linkedinStrategy = (passport, linkedinConfig) => {
  passport.use(new LinkedInStrategy({
    consumerKey: linkedinConfig.clientID,
    consumerSecret: linkedinConfig.clientSecret,
    callbackURL: '/api/auth/linkedin/callback',
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url'],
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    // @TODO look for user with email + providerName.id eql to profile.id
    console.log('*** LINKEDIN AUTH CALLBACK ***');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log('*** END ***');
    done();
  }));
};

export default linkedinStrategy;
