import chalk from 'chalk';
import env from '../env';
import * as db from './db';
import * as express from './express';

const init = (cb) => {
  db.connect((dbInstance) => {
    // Initialize express
    const app = express.init();
    if (cb) cb(app, dbInstance, env);
  });
};

export const start = (cb) => {
  init((app, dbInstance, envConfig) => {
    // Start the app by listening on <port> at <host>
    app.listen(envConfig.port, envConfig.host, () => {
      // Create server URL
      const protocol = envConfig.nodeEnv === 'secure' ? 'https://' : 'http://';
      const server = `${protocol}${envConfig.host}:${envConfig.port}`;

      // Logging initialization
      console.log('--');
      console.log(chalk.green(`Environment: ${env.nodeEnv}`));
      console.log(chalk.green(`Server: ${server}`));
      console.log(chalk.green(`Database: ${env.db.uri}`));
      console.log('--');

      // callback then ... call back
      if (cb) cb(app, db, env);
    });
  });
};
