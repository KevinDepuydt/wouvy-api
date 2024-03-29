import axios from 'axios';
import GitHubStrategy from 'passport-github';
import User from '../models/user';

const getUserEmail = (accessToken, githubData) => (
  new Promise((resolve, reject) => {
    if (githubData.email) {
      resolve(githubData);
    } else {
      axios.get('https://api.github.com/user/emails', {
        headers: {
          'user-agent': 'my user-agent',
          authorization: `token ${accessToken}`,
        },
      }).then((res) => {
        // found emails
        let emails = res.data.filter(emailObj => emailObj.verified && emailObj.primary);
        if (emails.length === 0) {
          emails = res.data.filter(emailObj => emailObj.verified);
        }
        // resolve email
        if (emails.length > 0) {
          githubData.email = emails[0].email;
          return resolve(githubData);
        }

        reject(new Error('No email found'));
      }).catch(reject);
    }
  })
);

const processNewUser = (accessToken, refreshToken, githubData, done) => {
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
        .catch((errB) => {
          // looking for existing user with another social network
          // to add new social network to his account
          User.findOne({ email: githubData.email, 'providers.github': { $exists: false }, providers: { $not: { $size: 0 } } }, (errC, existingUser) => {
            if (errC) {
              done(errC, null);
            } else if (existingUser) {
              if (!existingUser.providers.github) {
                existingUser.providers.github = {
                  id: githubData.id,
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
};

const githubStrategy = (passport, githubConfig) => {
  passport.use(new GitHubStrategy({
    clientID: githubConfig.clientID,
    clientSecret: githubConfig.clientSecret,
    callbackURL: '/api/auth/github/callback',
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const githubData = profile._json;
    // get user email and process with user data
    getUserEmail(accessToken, githubData).then((githubDataUpdated) => {
      processNewUser(accessToken, refreshToken, githubDataUpdated, done);
    }).catch(console.error);
  }));
};

export default githubStrategy;
