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
};

export default productionEnv;