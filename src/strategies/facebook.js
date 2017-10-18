import FacebookStrategy from 'passport-facebook';
import User from '../models/user';

const facebookStrategy = (passport, facebookConfig) => {
  passport.use(new FacebookStrategy({
    clientID: facebookConfig.clientID,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const fbData = profile._json;
    // find user by mail and facebook provider id
    User.findOne({ email: fbData.email, 'providers.facebook.id': fbData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: fbData.email,
          firstname: fbData.first_name,
          lastname: fbData.last_name,
          username: fbData.name,
          password: Math.random().toString(36).slice(2),
          picture: fbData.picture.data.url,
          'providers.facebook': {
            id: fbData.id,
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

export default facebookStrategy;
