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
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:4200',
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
      clientID: process.env.GITHUB_ID || '2ac0c2559131f0144915',
      clientSecret: process.env.GITHUB_SECRET || 'f5f4a1f3fb4719bf8bc2f6a1066e332df17cee3e',
    },
    twitter: {
      clientID: process.env.TWITTER_ID || 'EhEAqmH1NRMFtsHoiG7PP0VRw',
      clientSecret: process.env.TWITTER_SECRET || 'Q8ZofHcVc8LRdvtMzRZXki7i2M27JAXSJix94ixE2w2eA9KMwW',
    },
  },
};

export default developmentEnv;
