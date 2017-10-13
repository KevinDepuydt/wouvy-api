const productionEnv = {
  db: {
    uri: process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1'}/wouvy`,
    options: {
      useMongoClient: true,
    },
    debug: process.env.MONGODB_DEBUG || false,
    promise: Promise,
  },
  port: process.env.PORT,
  host: process.env.HOST,
  nodeEnv: process.env.NODE_ENV,
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '120288108438256',
      clientSecret: process.env.FACEBOOK_SECRET || '0a001f467e2bd5ee29f4e5d3e63b046a',
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

export default productionEnv;
