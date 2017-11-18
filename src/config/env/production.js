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
  nodeEnv: process.env.NODE_ENV || 'production',
  appUrl: process.env.APP_URL || 'https://app.wouvy.fr',
  socialCredentials: {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '120288108438256',
      clientSecret: process.env.FACEBOOK_SECRET || '0a001f467e2bd5ee29f4e5d3e63b046a',
    },
    google: {
      clientID: process.env.GOOGLE_ID || '230432657244-dei6mk6up0nvmp5g5ke4s8de85e5mcor.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || 'rmFdrTo-4JFDAm81qIPVN4tT',
    },
    linkedin: {
      clientID: process.env.LINKEDIN_ID || '78r8nh2y0sj4hj',
      clientSecret: process.env.LINKEDIN_SECRET || 'vtCUTSPhGnRjtJKB',
    },
    github: {
      clientID: process.env.GITHUB_ID || 'a82fdbbc9451c29b9d0d',
      clientSecret: process.env.GITHUB_SECRET || 'e6424cbcc1251c1afb0ac2e048bd1941e186f170',
    },
    twitter: {
      clientID: process.env.TWITTER_ID || 'crHU9HAmfJUjwJ4i3PPMDBPBn',
      clientSecret: process.env.TWITTER_SECRET || 'VsaLmLfY2bEvpgGHj0GIHYNPpYE5xi7Z7YYaHXaQyGE11tW4XL',
    },
  },
};

export default productionEnv;
