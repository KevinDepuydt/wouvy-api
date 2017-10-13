const developmentEnv = {
  db: {
    uri: 'mongodb://127.0.0.1/wouvy-dev',
    options: {
      useMongoClient: true,
    },
    debug: false,
    promise: Promise,
  },
  port: 3000,
  host: '127.0.0.1',
  nodeEnv: 'development',
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '120323061768094',
      clientSecret: process.env.FACEBOOK_SECRET || '6447867cb0a30178397f68f5b3150c56',
    },
    google: {
      clientID: process.env.GOOGLE_ID || '884838643361-ro8mc5e0caucgeaqq3bvdckr10jvsnb6.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || '3DCfw1kh2ZoWF9Bbpe8FVUbU',
    },
    linkedin: { // credentials to replace
      clientID: process.env.LINKEDIN_ID || '78r8nh2y0sj4hj',
      clientSecret: process.env.LINKEDIN_SECRET || 'vtCUTSPhGnRjtJKB',
    },
    github: {
      clientID: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    },
    twitter: {
      clientID: process.env.TWITTER_ID || '',
      clientSecret: process.env.TWITTER_SECRET || '',
    },
  },
};

export default developmentEnv;
