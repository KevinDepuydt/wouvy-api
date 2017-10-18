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
  appUrl: 'http://localhost:4200',
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '120323061768094',
      clientSecret: process.env.FACEBOOK_SECRET || '6447867cb0a30178397f68f5b3150c56',
    },
    google: {
      clientID: process.env.GOOGLE_ID || '230432657244-ims9kqgk47nfeiq6ail3c0igdbv21k3l.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || 'hRLJK4MRddnv8bu1HD7RJRRu',
    },
    linkedin: {
      clientID: process.env.LINKEDIN_ID || '78pof83gkkg4np',
      clientSecret: process.env.LINKEDIN_SECRET || 'XwqEgGGODCaxuMJ0',
    },
    github: {
      clientID: process.env.GITHUB_ID || 'git',
      clientSecret: process.env.GITHUB_SECRET || 'pass',
    },
    twitter: {
      clientID: process.env.TWITTER_ID || 'twi',
      clientSecret: process.env.TWITTER_SECRET || 'pass',
    },
  },
};

export default developmentEnv;
