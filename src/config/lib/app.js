import chalk from 'chalk';
import env from '../env';
import * as db from './db';
import * as express from './express';

const init = (cb) => {
  db.connect((db) => {
    // Initialize express
    const app = express.init(db);
    if (cb) cb(app, db, env);
  });
};

export const start = (cb) => {
  init((app, db, env) => {
    // Start the app by listening on <port> at <host>
    app.listen(env.port, env.host, () => {
      // Create server URL
      const server = (env.nodeEnv === 'secure' ? 'https://' : 'http://') + env.host + ':' + env.port;

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
