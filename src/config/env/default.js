const defaultEnv = {
  db: {
    uri: process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1'}/node-api-starter`,
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false,
    promise: Promise,
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV,
};

export default defaultEnv;
