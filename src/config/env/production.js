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
};

export default productionEnv;
