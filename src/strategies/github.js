import GitHubStrategy from 'passport-github';
import User from '../models/user';

const githubStrategy = (passport, githubConfig) => {
  passport.use(new GitHubStrategy({
    clientID: githubConfig.clientID,
    clientSecret: githubConfig.clientSecret,
    callbackURL: '/api/auth/github/callback',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const githubData = profile._json;
    // find user by mail and github provider id
    User.findOne({ email: githubData.email, 'providers.github.id': githubData.id }, (err, user) => {
      if (err) {
        done(err, null);
      } else if (user) {
        done(null, user);
      } else {
        // define new User
        const newUser = new User({
          email: githubData.email,
          username: githubData.login,
          password: Math.random().toString(36).slice(2),
          picture: githubData.avatar_url,
          'providers.github': {
            id: githubData.id,
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

export default githubStrategy;
