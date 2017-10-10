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
};

export default developmentEnv;
