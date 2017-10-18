const productionEnv = {
  db: {
    uri: 'mongodb://127.0.0.1/wouvy-test',
    options: {
      useMongoClient: true,
    },
    debug: false,
    promise: Promise,
  },
  nodeEnv: 'test',
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || 'facebook_id',
      clientSecret: process.env.FACEBOOK_SECRET || 'facebook_secret',
    },
    google: {
      clientID: process.env.GOOGLE_ID || 'google_id',
      clientSecret: process.env.GOOGLE_SECRET || 'google_secret',
    },
    linkedin: { // credentials to replace
      clientID: process.env.LINKEDIN_ID || 'linkedin_id',
      clientSecret: process.env.LINKEDIN_SECRET || 'linkedin_secret',
    },
    github: {
      clientID: process.env.GITHUB_ID || 'github_id',
      clientSecret: process.env.GITHUB_SECRET || 'github_secret',
    },
    twitter: {
      clientID: process.env.TWITTER_ID || 'twitter_id',
      clientSecret: process.env.TWITTER_SECRET || 'twitter_secret',
    },
  },
};

export default productionEnv;
