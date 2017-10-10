import _ from 'lodash';
import defaultEnv from './default';
import developmentEnv from './development';
import productionEnv from './production';
import testEnv from './test';

let env = null;

// extends the right env configuration
if (process.env.NODE_ENV === 'test') {
  env = _.assign(defaultEnv, testEnv);
} else if (process.env.NODE_ENV !== 'production') {
  env = _.assign(defaultEnv, developmentEnv);
} else {
  env = _.assign(defaultEnv, productionEnv);
}

export default env;
