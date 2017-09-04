const developmentEnv = {
  db: {
    uri: `mongodb://127.0.0.1/node-api-starter`,
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: false,
    promise: Promise,
  },
  port: 3000,
  host: '127.0.0.1',
  nodeEnv: 'development',
};

export default developmentEnv;
