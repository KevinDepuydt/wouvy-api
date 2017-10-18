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
  appUrl: 'https://app.wouvy.fr',
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '120288108438256',
      clientSecret: process.env.FACEBOOK_SECRET || '0a001f467e2bd5ee29f4e5d3e63b046a',
    },
    google: {
      clientID: process.env.GOOGLE_ID || '230432657244-dei6mk6up0nvmp5g5ke4s8de85e5mcor.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || 'rmFdrTo-4JFDAm81qIPVN4tT',
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
